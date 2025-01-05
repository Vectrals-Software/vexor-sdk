import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { Vexor } from "../../../methods";
import { VexorPaymentBody } from "../../../types/requests";
import { VexorPaymentResponse } from "../../../types/responses";
import { v4 as uuidv4 } from 'uuid';

const createMercadoPagoCheckout = async (
    vexor: Vexor,
    body: VexorPaymentBody
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

        const itemsWithIds = body.items.map(item => ({
            ...item,
            id: item.id || uuidv4()
        }));

        const identifier = uuidv4();

        const preferenceBody: any = {
            items: itemsWithIds,
            binary_mode: true,
            metadata: {
                identifier: identifier
            },
            external_reference: identifier,
            back_urls: {
                success: body.options?.successRedirect || 'http://localhost:3000',
                pending: body.options?.pendingRedirect || 'http://localhost:3000',
                failure: body.options?.failureRedirect || 'http://localhost:3000'
            }
        };


        const API_URL = SUPPORTED_PLATFORMS.MERCADO_PAGO.base_url.production;

        // Make the API call to Mercadopago
        const preference_response: any = await fetch(`${API_URL}/checkout/preferences`, {
            method: "POST",
            body: JSON.stringify(preferenceBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${mercadopagoAccessToken}`,
            },
        })

        // Get the API response
        const result = await preference_response.json();

        return {
            message: 'Mercadopago checkout created',
            payment_url: result.init_point,
            raw: result,
            identifier
        }

    } catch (error) {
        console.error('Error creating MercadoPago checkout', error);
        throw error;
    }
}

export default createMercadoPagoCheckout;   