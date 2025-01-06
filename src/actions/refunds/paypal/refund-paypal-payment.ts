import retrieveStripeOperation from "@/actions/retrievals/stripe/retrieve-stripe-operation";
import { serializeToPlainObject } from "@/lib/object-serialize";
import Stripe from "stripe";
import { Vexor } from "../../../methods";
import { VexorRefundBody } from "../../../types/requests";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { generatePaypalAccessToken } from "@/actions/authorizations/paypal/generate-paypal-access-token";
import retrievePaypalOperation from "@/actions/retrievals/paypal/retrieve-paypal-operation";

const refundPaypalPayment = async (
    vexor: Vexor,
    body: VexorRefundBody
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

        
        // Retrieve the payment
        const payment_response = await retrievePaypalOperation(vexor, body.identifier)

        // A paypal order is not completed -and can't be refunded- until a capture is created
        if (!payment_response.raw?.capture) {
            throw new Error('Paypal payment capture not found. Order is not completed yet or not found.');
        }

        // Get the payment capture id
        const paymentCaptureId = payment_response.raw.capture.id

        // Refund the payment
        const refund_response = await fetch(`${API_URL}/v2/payments/captures/${paymentCaptureId}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'PayPal-Request-Id': body.identifier
            }
        })

        // Check if the refund was successful
        if (!refund_response.ok && (refund_response.status !== 200 && refund_response.status !== 201)) {
            throw new Error('Error refunding Paypal payment');
        }
    
        return {
            message: 'Paypal payment refunded',
            raw: serializeToPlainObject(await refund_response.json()),
            identifier: body.identifier as string
        }
      

    } catch (error: any) {
        return {
            message: 'Error refunding Paypal payment',
            raw: error,
            identifier: body.identifier as string,
            error: error.message || 'Unknown error'
        }
    }
}

export default refundPaypalPayment;   