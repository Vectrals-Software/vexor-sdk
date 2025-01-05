import retrieveStripeOperation from "@/actions/retrievals/stripe/retrieve-stripe-operation";
import { serializeToPlainObject } from "@/lib/object-serialize";
import Stripe from "stripe";
import { Vexor } from "../../../methods";
import { VexorRefundBody } from "../../../types/requests";

const refundStripePayment = async (
    vexor: Vexor,
    body: VexorRefundBody
) => {

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.stripe

        if (!platformCredentials) {
            throw new Error('Stripe credentials not found');
        }

        const stripeSecretKey = platformCredentials.secret_key

        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not found');
        }

        const stripe = new Stripe(stripeSecretKey);
        
        // Retrieve the payment
        const payment_response = await retrieveStripeOperation(vexor, body.identifier)

        if (!payment_response.raw) {
            throw new Error('Stripe payment not found');
        }

        // Get the payment id
        const paymentId = payment_response.raw.id

        // Refund the payment
        const refund_response = await stripe.refunds.create({
            payment_intent: paymentId,
            metadata: {
                identifier: body.identifier
            }
        });

        return {
            message: 'Stripe payment refunded',
            raw: serializeToPlainObject(refund_response),
            identifier: body.identifier as string
        }
      

    } catch (error: any) {
        return {
            message: 'Error refunding Stripe payment',
            raw: error,
            identifier: body.identifier as string,
            error: error.message || 'Unknown error'
        }
    }
}

export default refundStripePayment;   