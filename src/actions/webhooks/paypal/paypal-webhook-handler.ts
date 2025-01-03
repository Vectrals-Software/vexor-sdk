import { verifyPaypalSignature } from "@/actions/authorizations/paypal/verify-paypal-signature";
import { capturePaypalPayment } from "@/actions/captures/paypal/capture-paypal-payment";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { SupportedVexorPlatform, Vexor } from "@/methods";
import { VexorWebhookResponse } from "@/types/responses";
import crc32 from "buffer-crc32";
import crypto from "crypto";

export const handlePaypalWebhook = async (vexor: Vexor, req: any) => {


    const request = await req.text();
    const headersList = req.headers;
    const transmissionId = headersList.get('paypal-transmission-id');
    const timeStamp = headersList.get('paypal-transmission-time');
    const certUrl = headersList.get('paypal-cert-url');
    const authAlgo = headersList.get('paypal-auth-algo');
    const transmissionSig = headersList.get('paypal-transmission-sig');
    const crc = parseInt("0x" + crc32(Buffer.from(request)).toString('hex'));

    try {


        const body = JSON.parse(request)

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.paypal

        if (!platformCredentials) {
            throw new Error('Paypal credentials not found');
        }

        const paypalSecretKey = platformCredentials.secret_key
        const paypalWebhookId = platformCredentials.webhook_id

        if (!paypalSecretKey) {
            throw new Error('Paypal secret key not found');
        }

        if (!paypalWebhookId) {
            throw new Error('Paypal webhook id not found');
        }

        let orderId
        switch (body.event_type) {
            case 'CHECKOUT.ORDER.APPROVED':
                orderId = body.resource.id;
                break;
            case 'PAYMENT.CAPTURE.COMPLETED':
                orderId = body.resource.supplementary_data?.related_ids?.order_id;
                break;
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                orderId = body.resource.id;
                break;
            case 'BILLING.SUBSCRIPTION.REACTIVATED':
                orderId = body.resource.id;
                break;
            case 'PAYMENT.SALE.COMPLETED':
                orderId = body.resource.billing_agreement_id;
                break;
            default:
                console.error('Unhandled event type:', body.event_type);
                return {
                    message: 'Unhandled event type: ' + body.event_type,
                    status: 'error',
                    platform: SUPPORTED_PLATFORMS.PAYPAL.name as SupportedVexorPlatform,
                    resource: null,
                    eventType: body.event_type,
                    transmissionId: transmissionId || '',
                    identifier: '',
                    timeStamp: new Date().toISOString(),
                    orderId: '',
                }
        }

        // Create the message to verify the signature
        const message = `${transmissionId}|${timeStamp}|${paypalWebhookId}|${crc}`;

        // Verify the signature
        const isValidSignature = await verifyPaypalSignature(message, transmissionSig, certUrl, authAlgo);

        if (!isValidSignature) {
            throw new Error('Invalid signature');
        }



        let status = 'pending'
        let responseMessage = 'Event processed';
        switch (body.event_type) {
            case 'CHECKOUT.ORDER.APPROVED':
                const captureResponse = await capturePaypalPayment(vexor, body.resource.id)
                const data = await captureResponse.json();
                //console.log('Payment capture response:', data);
                if (data.error) {
                    responseMessage = 'Error capturing payment: ' + data.error;
                } else {
                    responseMessage = 'Payment approved with order id: ' + orderId;
                }
                break;
            case 'PAYMENT.CAPTURE.COMPLETED':
                //console.log('Payment captured with order id:', orderId);
                responseMessage = 'Payment captured with order id: ' + orderId;
                status = 'paid'
                break;
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                //console.log('Subscription activated with id:', orderId);
                responseMessage = 'Subscription activated with id: ' + orderId;
                status = 'active';
                break;
            case 'PAYMENT.SALE.COMPLETED':
                //console.log('Subscription payment completed with id:', orderId);
                responseMessage = 'Subscription payment completed with id: ' + orderId;
                status = 'paid';
                break;
            case 'BILLING.SUBSCRIPTION.REACTIVATED':
                //console.log('Subscription reactivated with id:', orderId);
                responseMessage = 'Subscription reactivated with id: ' + orderId;
                status = 'active';
                break;
            case 'PAYMENT.CAPTURE.REFUNDED':
                //console.log('Payment captured refunded with id:', orderId);
                responseMessage = 'Payment captured refunded with id: ' + orderId;
                status = 'refunded';
                break;
            default:
                //console.log('Unhandled event type:', body.event_type);
                responseMessage = 'Unhandled event type: ' + body.event_type;
        }


        const response: VexorWebhookResponse = {
            message: responseMessage,
            status: status,
            platform: SUPPORTED_PLATFORMS.PAYPAL.name as SupportedVexorPlatform,
            identifier: orderId as string,
            transmissionId: transmissionId as string,
            timeStamp: timeStamp as string,
            orderId: orderId as string,
            eventType: body.event_type,
            resource: body.resource,
        }

        return response;
    } catch (error) {
        console.error(error);
        return {
            message: 'Error processing Paypal webhook',
            status: 'error',
            transmissionId: transmissionId || '',
            identifier: '',
            timeStamp: new Date().toISOString(),
            orderId: '',
            eventType: '',
            platform: SUPPORTED_PLATFORMS.PAYPAL.name as SupportedVexorPlatform,
            resource: 'null',
        } as VexorWebhookResponse
    }
}