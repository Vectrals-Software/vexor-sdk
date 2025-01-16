import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { formatInterval } from "@/lib/format-interval";
import { Vexor } from "@/methods";
import { VexorSubscriptionBody } from "@/types/requests";
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const createStripeSubscription = async (
    vexor: Vexor,
    body: VexorSubscriptionBody
) => {

    const identifier = uuidv4();

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.stripe

        if (!platformCredentials) {
            throw new Error('Stripe credentials not found');
        }

        const stripeSecretKey = platformCredentials.secret_key

        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not found');
        }

        const stripe = new Stripe(stripeSecretKey);
        const formattedInterval = formatInterval(body.interval, SUPPORTED_PLATFORMS.STRIPE.name);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: body.customer?.email,
            success_url: body.successRedirect,
            cancel_url: body.failureRedirect ?? `${body.successRedirect}?canceled=true`,
            line_items: [
                {
                    price_data: {
                        currency: body.currency,
                        product_data: {
                            name: body.name,
                            description: body.description ?? undefined,
                        },
                        unit_amount: body.price * 100,
                        recurring: { 
                            interval: formattedInterval as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval
                        },
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                identifier: identifier
            },
        }) ;


        return {
            message: 'Subscription checkout created',
            payment_url: session.url as string,
            raw: { ...session },
            identifier
        }

    } catch (error: any) {
        console.error(error);

        if (error instanceof Stripe.errors.StripeError) {
            return { payment_url: '', raw: JSON.stringify(error), identifier: error.type,  message: error.message };
        }

        throw error;
    }
}

export default createStripeSubscription;   