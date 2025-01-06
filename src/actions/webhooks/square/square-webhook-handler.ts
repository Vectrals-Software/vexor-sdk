import { verifySquareSignature } from "@/actions/authorizations/square/verify-square-signature";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { SupportedVexorPlatform, Vexor } from "@/methods";
import { VexorWebhookResponse } from "@/types/responses";

export const handleSquareWebhook = async (vexor: Vexor, req: any) => {

    const request = await req.text();
    const signature = req.headers.get('x-square-hmacsha256-signature') as string;

    try {


        const body = JSON.parse(request)

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.square

        if (!platformCredentials) {
            throw new Error('Paypal credentials not found');
        }

        const squareAccessToken = platformCredentials.access_token
        const squareApplicationId = platformCredentials.application_id
        const squareWebhooksUrl = platformCredentials.webhooks_url
        const squareWebhookSignatureKey = platformCredentials.webhook_signature_key

        if (!squareAccessToken) {
            throw new Error('Square access token not found');
        }

        if (!squareApplicationId) {
            throw new Error('Square application id not found');
        }

        if (!squareWebhooksUrl) {
            throw new Error('Square webhooks url not found');
        }

        if (!squareWebhookSignatureKey) {
            throw new Error('Square webhook signature key not found');
        }

        // Verify the signature
        const isValidSignature = verifySquareSignature({
            request,
            signature,
            webhook_signature_key: squareWebhookSignatureKey,
            webhooks_url: squareWebhooksUrl,
        });

        if (!isValidSignature) {
            throw new Error('Invalid signature');
        }

 
        let identifier = '';
        let status = '';
        switch (body.type) {
            case 'payment.updated':
                identifier = body.data.object.payment.order_id;
                status = body.data.object.payment.status;
                //console.log('Payment updated', body.data.object.payment.order_id);
                break;

            case 'order.updated':
                identifier = body.data.object.order_updated.order_id;
                status = body.data.object.order_updated.state;
                //console.log('Order updated', body.data.object.order_updated.order_id);
                break;

            default:
                console.error('Unhandled event type:', body.type);

                return {
                    message: 'Unhandled event type: ' + body.type,
                    status: 'unhandled_event_type',
                    platform: SUPPORTED_PLATFORMS.SQUARE.name as SupportedVexorPlatform,
                    identifier: '',
                    transmissionId: '',
                    timeStamp: new Date().toISOString(),
                    orderId: '',
                    eventType: '',
                    resource: 'null',
                } as VexorWebhookResponse
        }


        let responseMessage = 'Event processed';

        const response: VexorWebhookResponse = {
            message: responseMessage,
            status: status,
            platform: SUPPORTED_PLATFORMS.SQUARE.name as SupportedVexorPlatform,
            identifier: identifier as string,
            transmissionId: body.data.id,
            timeStamp: new Date().toISOString(),
            orderId: identifier,
            eventType: body.type,
            resource: body.data
        }

        return response;
    } catch (error) {
        console.error(error);
        return {
            message: 'Error processing Square webhook',
            status: 'error',
            transmissionId: '',
            identifier: '',
            timeStamp: new Date().toISOString(),
            orderId: '',
            eventType: '',
            platform: SUPPORTED_PLATFORMS.SQUARE.name as SupportedVexorPlatform,
            resource: '',
        } as VexorWebhookResponse
    }
}