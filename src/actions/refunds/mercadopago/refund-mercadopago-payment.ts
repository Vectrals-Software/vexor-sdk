import { generate_x_IdempotencyKey } from "@/lib/idemopotency-keygen";
import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { Vexor } from "../../../methods";
import { VexorPaymentBody, VexorRefundBody } from "../../../types/requests";
import { VexorPaymentResponse } from "../../../types/responses";
import { v4 as uuidv4 } from 'uuid';
import retrieveMercadoPagoOperation from "@/actions/retrievals/mercadopago/retrieve-mercadopago-operation";

const refundMercadoPagoPayment = async (
    vexor: Vexor,
    body: VexorRefundBody
) => {

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.mercadopago

        if (!platformCredentials) {
            throw new Error('MercadoPago credentials not found');
        }

        const mercadopagoAccessToken = platformCredentials.access_token

        if (!mercadopagoAccessToken) {
            throw new Error('MercadoPago access token not found');
        }

     
        const idempotency_key = generate_x_IdempotencyKey()


        const API_URL = SUPPORTED_PLATFORMS.MERCADO_PAGO.base_url.production;

        
        // Retrieve the payment
        const payment_response = await retrieveMercadoPagoOperation(vexor, body.identifier)

        if (!payment_response.raw) {
            throw new Error('MercadoPago payment not found');
        }

        const paymentId = payment_response.raw.id

        // Refund the payment
         // Make the API call to Mercadopago
         const refund_response: any = await fetch(`${API_URL}/v1/payments/${paymentId}/refunds`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${mercadopagoAccessToken}`,
                "X-Idempotency-Key": idempotency_key
            }
        }).then(res => res.json());
        
        if (refund_response.error) {
            throw new Error(refund_response.error);
        }

        return {
            message: 'MercadoPago payment refunded',
            raw: refund_response,
            identifier: body.identifier as string
        }
      

    } catch (error: any) {
        return {
            message: 'Error refunding MercadoPago payment',
            raw: error,
            identifier: body.identifier as string,
            error: error.message || 'Unknown error'
        }
    }
}

export default refundMercadoPagoPayment;   