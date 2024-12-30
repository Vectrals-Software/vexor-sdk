import { VexorPaymentBody } from "../../../types/requests";
import { Vexor } from "../../../methods";
import { VexorPaymentResponse } from "../../../types/responses";
import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { v4 as uuidv4 } from 'uuid';
import { generate_x_IdempotencyKey } from "../../../lib/idemopotency-keygen";
import { getSquareLocation } from "../../authorizations/square/get-square-location";

const createSquareCheckout = async (
    vexor: Vexor,
    body: VexorPaymentBody
) => {

 
    try {
           // Get the platform credentials
           const platformCredentials = vexor.platforms?.square

           if (!platformCredentials) {
               throw new Error('Square credentials not found');
           }
   
           const squareAccessToken = platformCredentials.access_token
   
           if (!squareAccessToken) {
               throw new Error('Square access token not found');
           }

                // Check if it's a sandbox or production environment
        const isSandbox = platformCredentials?.sandbox === true;
        const API_URL = isSandbox ? SUPPORTED_PLATFORMS.SQUARE.base_url.sandbox : SUPPORTED_PLATFORMS.SQUARE.base_url.production;
           const mode = isSandbox ? 'sandbox' : 'production';

           // Get Square location id

           const locationsResponse = await getSquareLocation({
            url: API_URL,
            accessToken: squareAccessToken,
           });

           if (!locationsResponse.locations?.length) {
            return { 
                raw: locationsResponse,
                identifier: 'Square_token_error', 
                message: 'Error getting Square token.',
                payment_url: '',
            };
        }

        const squareLocationId = locationsResponse.locations[0].id;

        // ============ Create Square payment object ============
        const itemsWithIds = body.items.map(item => ({
            ...item,
            id: item.id || uuidv4()
        }));

        // Get the total amount of the payment
        const totalAmount = itemsWithIds.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

        // Get the names of the items and the quantity
        const itemNames = itemsWithIds.map(item => `${item.title} x${item.quantity}`).join(', ');

        const paymentObject = {
            idempotency_key: generate_x_IdempotencyKey(),
            quick_pay: {
                name: itemNames,
                price_money: {
                    amount: Number(totalAmount * 100),
                    currency: body.options?.currency || 'USD'
                },
                location_id: squareLocationId,
            },
            webhook_url: ''
        }

        if (platformCredentials.webhooks_url) {
            paymentObject.webhook_url = `${platformCredentials.webhooks_url}?source_news=webhooks&mode=${mode}&vexorPlatform=Square`;
        }

        // ============ Create Square payment link ============
        const result = await fetch(`${API_URL}/v2/online-checkout/payment-links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${squareAccessToken}`
            },
            mode: 'no-cors',
            body: JSON.stringify(paymentObject)
        }).then(res => res.json());

        const identifier = result.related_resources.orders[0].id;

        return { 
            message: 'Payment checkout created', 
            payment_url: result.payment_link.url, 
            raw: result, 
            identifier
        }
   

    } catch (error) {
        console.error('Error creating Square checkout', error);
        throw error;
    }
}

export default createSquareCheckout;   