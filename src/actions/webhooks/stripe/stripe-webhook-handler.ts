import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { Vexor } from "@/methods";
import { VexorWebhookResponse } from "@/types/responses";
import Stripe from "stripe";

async function getSubscriptionWithRetry(
    stripe: Stripe,
    subscriptionId: string,
    maxRetries = 10
): Promise<Stripe.Subscription> {
    for (let i = 0; i < maxRetries; i++) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (subscription.metadata?.identifier) {
            return subscription;
        }
        // Wait for 1 second before retrying (increases with each retry)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
    throw new Error('Subscription metadata not available after retries');
}


export const handleStripeWebhook = async (vexor: Vexor, req: any) => {

    const request = await req.text();
    const body = JSON.parse(request);

    const signature = req.headers.get('Stripe-Signature') as string;

    if (!signature) {
        return {
            message: 'Missing signature',
            status: 'error',
            transmissionId: '',
            identifier: '',
            timeStamp: new Date().toISOString(),
            orderId: '',
            eventType: '',
            platform: SUPPORTED_PLATFORMS.STRIPE.name,
            resource: null,
        } as VexorWebhookResponse
    }

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.stripe

        if (!platformCredentials) {
            //  throw new Error('Stripe credentials not found');
        }

        const stripePublicKey = platformCredentials?.public_key
        const stripeSecretKey = platformCredentials?.secret_key
        const stripeWebhookSecrets = platformCredentials?.webhook_secrets

        if (!stripePublicKey) {
            throw new Error('Stripe public key not found');
        }

        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not found');
        }

        if (!stripeWebhookSecrets?.length) {
            throw new Error('Stripe webhook secrets not found');
        }

        // Check if it's a sandbox or production environment
        const isSandbox = platformCredentials?.sandbox === true;
        const API_URL = isSandbox ? SUPPORTED_PLATFORMS.STRIPE.base_url.sandbox : SUPPORTED_PLATFORMS.STRIPE.base_url.production;

        let event: Stripe.Event | null = null;
        const stripe = new Stripe(stripeSecretKey, {
            typescript: true,
        });

        // Try each webhook secret until one works or all fail (you can have multiple webhooks secrets in Stripe for example: one for your account and one for connected -marketplace- accounts)
        for (const webhookSecret of stripeWebhookSecrets) {
            try {
                event = stripe.webhooks.constructEvent(
                    request,
                    signature,
                    webhookSecret
                );
                break; // If we get here, we found a working webhook secret
            } catch (err) {
                console.log('Webhook signature verification failed with a secret, trying next one if available');
                continue;
            }
        }

        if (!event) {
            console.error('Webhook signature verification failed with all secrets');
            return {
                message: 'Webhook signature verification failed',
                status: 'error',
                transmissionId: '',
                identifier: '',
                timeStamp: new Date().toISOString(),
                orderId: '',
                eventType: '',
                platform: SUPPORTED_PLATFORMS.STRIPE.name,
                resource: null,
            } as VexorWebhookResponse
        }


        // Check if the event is a subscription checkout
        const isSubscriptionCheckout = body.data.object.billing_reason === 'subscription_create' || body.data.object.mode === 'subscription';


        let responseMessage = 'Event processed';
        let status = 'pending'
        let identifier = '';

        switch (event.type) {
            case 'checkout.session.completed':
                 // console.log('Payment created with order id:', body.data.object.metadata.identifier);
                responseMessage = 'Payment created with order id: ' + body.data.object.metadata.identifier;
                status = body.data.object.payment_status;
                identifier = body.data.object.metadata.identifier;

                if (isSubscriptionCheckout) {
                    const subscriptionId = body.data.object.subscription;


                    // Update the Subscription with the metadata from the Checkout Session
                    const subscription = await stripe.subscriptions.update(subscriptionId, {
                        metadata: {
                            identifier: body.data.object.metadata.identifier
                        }
                    });

                   // console.log('Updated subscription:', subscription);


                    responseMessage = 'Subscription created and updated with identifier: ' + body.data.object.metadata.identifier;

                    identifier = body.data.object.metadata.identifier;

                }

                break;
            case 'invoice.payment_succeeded':
         
                identifier = body.data.object.metadata.identifier;

                responseMessage = 'Payment succeeded with invoice id: ' + body.data.object.metadata.identifier;
                status = body.data.object.payment_status || body.data.object.status;
                if (isSubscriptionCheckout) {
                    const subscriptionId = body.data.object.subscription;
                    try {
                        const subscription = await getSubscriptionWithRetry(stripe, subscriptionId);

                        //console.log('Subscription:', subscription);

                        responseMessage = 'Subscription payment succeeded and updated with id: ' + subscription.metadata.identifier;

                        // Get the identifier from the subscription
                        body.data.object.metadata.identifier = subscription.metadata.identifier;
                    
                        // Store the identifier in the response
                        identifier = subscription.metadata.identifier;
                    } catch (error) {
                        console.error('Failed to get subscription metadata:', error);
                        // You might want to handle this case differently
                        status = 'pending';
                        responseMessage = 'Subscription payment processed, but metadata not yet available';
                    }
                }
                // console.log('Payment succeeded with invoice id:', body.data.object.metadata.identifier);
                break;
            case 'account.updated':
                // console.log('Account updated:', body.data.object);
                status = 'success';
                responseMessage = 'Account updated with id: ' + body.data.object.metadata.identifier;
                identifier = body.data.object.metadata.identifier;
                break;
            default:
                console.error('Unhandled event type:', event.type);
                return {
                    message: 'Stripe events supported: checkout.session.completed, invoice.payment_succeeded. \nUsing vexor.webhook() with unsupported events may result in unnecessary operations charges. Please ensure you only use supported events to optimize your usage.',
                    status: 'error',
                    transmissionId: '',
                    identifier: '',
                    timeStamp: new Date().toISOString(),
                    orderId: '',
                    eventType: '',
                    platform: SUPPORTED_PLATFORMS.STRIPE.name,
                    resource: null,
                } as VexorWebhookResponse
        }



        return {
            message: responseMessage,
            status: status,
            transmissionId: body.data.object.id as string,
            identifier: identifier,
            timeStamp: new Date().toISOString(),
            orderId: body.data.object.payment_intent as string,
            eventType: event.type as string,
            platform: SUPPORTED_PLATFORMS.STRIPE.name,
            resource: body.data.object,
        } as VexorWebhookResponse

    } catch (error) {
        console.error(error);
        return {
            message: 'Error processing Stripe webhook',
            status: 'error',
            transmissionId: '',
            identifier: '',
            timeStamp: new Date().toISOString(),
            orderId: '',
            eventType: '',
            platform: SUPPORTED_PLATFORMS.STRIPE.name,
            resource: null,
        } as VexorWebhookResponse
    }
}

