import { generatePaypalAccessToken } from "@/actions/authorizations/paypal/generate-paypal-access-token";
import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { Vexor } from "../../../methods";

const retrievePaypalOperation = async (
    vexor: Vexor,
    identifier: string
) => {

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.paypal

        if (!platformCredentials) {
            throw new Error('Paypal credentials not found');
        }

        const paypalClientId = platformCredentials.client_id

        if (!paypalClientId) {
            throw new Error('Paypal client id not found');
        }

        const paypalSecretKey = platformCredentials.secret_key

        if (!paypalSecretKey) {
            throw new Error('Paypal secret key not found');
        }


        // Check if it's a sandbox or production environment
        const isSandbox = platformCredentials?.sandbox === true;
        const API_URL = isSandbox ? SUPPORTED_PLATFORMS.PAYPAL.base_url.sandbox : SUPPORTED_PLATFORMS.PAYPAL.base_url.production;

        // Generate the access token
        const accessToken = await generatePaypalAccessToken(paypalClientId, paypalSecretKey, API_URL);

        // Get the order details
        const orderResponse = await fetch(`${API_URL}/v2/checkout/orders/${identifier}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const orderData = await orderResponse.json();

        // If the order is captured, get the capture ID from the purchase units
        if (orderData.status === 'COMPLETED') {
            const captureId = orderData.purchase_units[0].payments.captures[0].id;
            
            // Now get the capture details
            const captureResponse = await fetch(`${API_URL}/v2/payments/captures/${captureId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            const captureData = await captureResponse.json();

            return {
                message: 'Paypal operation retrieved',
                raw: {
                    order: orderData,
                    capture: captureData
                },
                identifier
            }
        }

        // If order is not completed, return the order data
        return {
            message: 'Paypal operation retrieved',
            raw: orderData,
            identifier
        }

    } catch (error) {
        console.error('Error retrieving Paypal operation', error);
        throw error;
    }
}

export default retrievePaypalOperation;   