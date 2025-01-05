import { generateTaloAccessToken } from "@/actions/authorizations/talo/generate-talo-access-token";
import { retrieveTaloPayment } from "@/actions/retrievals/talo/retrieve-talo-payment";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { Vexor } from "@/methods";
import { SupportedVexorPlatform } from "@/types/platforms";
import { VexorWebhookResponse } from "@/types/responses";

export const handleTaloWebhook = async (vexor: Vexor, req: any) => {
    try {
        const request = await req.text();
        const body = JSON.parse(request);

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.talo;

        if (!platformCredentials) {
            throw new Error('Talo credentials not found');
        }

        const taloUserId = platformCredentials.user_id;
        const taloClientId = platformCredentials.client_id;
        const taloClientSecret = platformCredentials.client_secret;

        if (!taloUserId || !taloClientId || !taloClientSecret) {
            throw new Error('Talo credentials are incomplete');
        }

        // Get talo payment status
        const taloPaymentData = await retrieveTaloPayment(vexor, body.data?.id || body.paymentId);

        const response: VexorWebhookResponse = {
            message: body.message,
            status: taloPaymentData.data.status,
            platform: SUPPORTED_PLATFORMS.TALO.name as SupportedVexorPlatform,
            identifier: taloPaymentData.data.external_id,
            transmissionId: body.paymentId,
            timeStamp: new Date().toISOString(),
            orderId: taloPaymentData.data.id,
            eventType: taloPaymentData.data.message,
            resource: taloPaymentData,
        }

        return response;

    } catch (error) {
        console.log('Talo webhook error:', error);
        throw error; // Re-throw the actual error instead of creating a new one
    }
}