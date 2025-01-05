import Stripe from "stripe";
import { Vexor } from "../../../methods";

const retrieveStripeOperation = async (
    vexor: Vexor,
    identifier: string
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

        // Get the API response
        const operation_data = await stripe.paymentIntents.search({
            query: `metadata["identifier"]:"${identifier}"`,
        });

       
        const payment = operation_data.data[0]

        return {
            message: 'Stripe operation retrieved',
            raw: payment as Stripe.PaymentIntent,
            identifier
        }

    } catch (error) {
        console.error('Error retrieving Stripe operation', error);
        throw error;
    }
}

export default retrieveStripeOperation;   