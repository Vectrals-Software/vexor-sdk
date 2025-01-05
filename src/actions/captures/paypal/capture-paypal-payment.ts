import { VexorPaymentBody } from "@/types/requests";
import { Vexor } from "@/methods";
import { generatePaypalAccessToken } from "@/actions/authorizations/paypal/generate-paypal-access-token";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";

export const capturePaypalPayment = async (vexor: Vexor, orderId: string) => {


    try {

        const paypalSecretKey = vexor.platforms?.paypal?.secret_key

    if (!paypalSecretKey) {
        throw new Error('Paypal secret key not found');
    }   

    const paypalClientId = vexor.platforms?.paypal?.client_id

    if (!paypalClientId) {
        throw new Error('Paypal client id not found');
    }

    const isSandbox = vexor.platforms?.paypal?.sandbox === true;
    const API_URL = isSandbox ? SUPPORTED_PLATFORMS.PAYPAL.base_url.sandbox : SUPPORTED_PLATFORMS.PAYPAL.base_url.production;

    const paypalAccessToken = await generatePaypalAccessToken(paypalClientId, paypalSecretKey, API_URL)

    const response = await fetch(`${API_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${paypalAccessToken}`,
        },
    });

    return response;
    } catch (error) {
        console.error('Error capturing paypal payment:', error);
        throw new Error('Error capturing paypal payment');
    }

}