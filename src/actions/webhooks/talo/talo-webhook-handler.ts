import { generateTaloAccessToken } from "@/actions/authorizations/talo/generate-talo-access-token";
import { retrieveTaloPayment } from "@/actions/retrievals/talo/retrieve-talo-payment";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { Vexor } from "@/methods";
import { SupportedVexorPlatform } from "@/types/platforms";
import { VexorWebhookResponse } from "@/types/responses";

export const handleTaloWebhook = async (vexor: Vexor, req: any) => {

    const body = await req.json();

    try {

         // Get the platform credentials
         const platformCredentials = vexor.platforms?.talo

         if (!platformCredentials) {
             throw new Error('MercadoPago credentials not found');
         }
 
         const taloUserId = platformCredentials.user_id
         const taloClientId = platformCredentials.client_id
         const taloClientSecret = platformCredentials.client_secret
 
         if (!taloUserId || !taloClientId || !taloClientSecret) {
             throw new Error('Talo credentials not found');
         }

        // Get talo payment status
        const taloPaymentData = await retrieveTaloPayment(vexor, body.data.id);

        const response: VexorWebhookResponse = {
            message: taloPaymentData.message,
            status: taloPaymentData.status,
            platform: SUPPORTED_PLATFORMS.TALO.name as SupportedVexorPlatform,
            identifier: taloPaymentData.id,
            transmissionId: body.data.id,
            timeStamp: new Date().toISOString(),
            orderId: body.data.id,
            eventType: body.message,
            resource: taloPaymentData,
        }

        return response;

    } catch (error) {
        console.log('Talo webhook body:', body);
        throw new Error('Talo webhook body is not a valid JSON');
    }

    console.log('Talo webhook body:', body);
}