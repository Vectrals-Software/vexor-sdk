import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { Vexor } from "../../../methods";
import { VexorPaymentBody } from "../../../types/requests";
import { VexorPaymentResponse } from "../../../types/responses";
import { v4 as uuidv4 } from 'uuid';

const retrieveMercadoPagoOperation = async (
    vexor: Vexor,
    identifier: string
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


        const API_URL = SUPPORTED_PLATFORMS.MERCADO_PAGO.base_url.production;


        // Endpoint exaample: https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=ID_REF&range=date_created&begin_date=NOW-30DAYS&end_date=NOW&store_id=47792478&pos_id=58930090&collector.id=448876418&payer.id=1162600213'
        // Make the API call to Mercadopago
        const operation_response: any = await fetch(`${API_URL}/v1/payments/search?sort=date_created&criteria=desc&external_reference=${identifier}&begin_date=NOW-364DAYS&end_date=NOW`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${mercadopagoAccessToken}`,
            },
        })

        // Get the API response
        const operation_data = await operation_response.json();

        // Get the payment
        const payment = operation_data.results[0]

        return {
            message: 'Mercadopago operation retrieved',
            raw: payment,
            identifier
        }

    } catch (error) {
        console.error('Error retrieving MercadoPago operation', error);
        throw error;
    }
}

export default retrieveMercadoPagoOperation;   