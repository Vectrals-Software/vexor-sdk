import { VexorPaymentBody } from "../../../types/requests";
import { Vexor } from "../../../methods";
import { VexorPaymentResponse } from "../../../types/responses";
import { generateTaloAccessToken } from "../../authorizations/talo/generate-talo-access-token";
import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { v4 as uuidv4 } from 'uuid';

const createTaloCheckout = async (
    vexor: Vexor,
    body: VexorPaymentBody
) => {

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

        // Check if it's a sandbox or production environment
        const isSandbox = platformCredentials?.sandbox === true;
        const mode = isSandbox ? 'sandbox' : 'production';
        const API_URL = isSandbox ? SUPPORTED_PLATFORMS.TALO.base_url.sandbox : SUPPORTED_PLATFORMS.TALO.base_url.production;


        const tokenResult = await generateTaloAccessToken({
            user_id: taloUserId,
            client_id: taloClientId,
            client_secret: taloClientSecret,
            url: API_URL
        });

        if (!tokenResult.data?.token) {
            return { 
                raw: 'talo_token_error', 
                message: 'Error getting Talo token.',
                payment_url: 'null',
                identifier: 'null'
            };
        }

        const taloToken = tokenResult.data.token;

        const itemsWithIds = body.items.map(item => ({
            ...item,
            id: item.id || uuidv4()
        }));


        // ============ Create talo payment object ============


        const identifier = uuidv4();

        // Get the total amount of the payment
        const totalAmount = itemsWithIds.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

        // Get the names of the items and the quantity
        const itemNames = itemsWithIds.map(item => `${item.title} x${item.quantity}`).join(', ');

        const paymentObject = {
            price: {
                currency: body.options?.currency || 'ARS',
                amount: Number(totalAmount)
            },
            user_id: taloUserId,
            redirect_url: body.options?.successRedirect || 'http://localhost:3000/success',
            motive: itemNames,
            external_id: identifier || uuidv4(),
            webhook_url: ``,
            payment_options: body.options?.paymentMethods || ['crypto']
        }

        if (platformCredentials.webhooks_url) {
            paymentObject.webhook_url = `${platformCredentials.webhooks_url}?source_news=webhooks&mode=${mode}&vexorPlatform=talo`;
        }

          // Get talo payment link
          const result = await fetch(`${API_URL}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${taloToken}`
            },
            body: JSON.stringify(paymentObject)
        }).then(res => res.json());

        if (result.code !== 200) {
            return { 
                message: 'talo_payment_error', 
                raw: result, 
                payment_url: 'null',
                identifier: 'null'
            };
        }


        return { 
            message: 'Talo checkout created', 
            payment_url: result.data.payment_url as string, 
            raw: result, 
            identifier
        }


    } catch (error) {
        console.error('Error creating Talo checkout', error);
        throw error;
    }
}

export default createTaloCheckout;   