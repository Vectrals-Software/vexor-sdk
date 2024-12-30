import { VexorPaymentBody } from "../../../types/requests";
import { Vexor } from "../../../methods";
import { VexorPaymentResponse } from "../../../types/responses";
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const createStripeCheckout = async (
    vexor: Vexor,
    body: VexorPaymentBody
) => {

    const identifier = uuidv4();

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

        const lineItems = body.items.map(item => ({
            price_data: {
                currency: body.options?.currency || 'usd',
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.unit_price * 100),
            },
            quantity: item.quantity,
        }));

        const checkoutSessionBody: any = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            metadata: {
                identifier: identifier
            },
            success_url: body.options?.successRedirect || 'http://localhost:3000/success',
            cancel_url: body.options?.failureRedirect || 'http://localhost:3000/failure',
        };


        const result = await stripe.checkout.sessions.create(checkoutSessionBody);


        return {
            message: 'Payment checkout created',
            payment_url: result.url as string,
            raw: { ...result },
            identifier
        }

    } catch (error) {
        console.error('Error creating Stripe checkout', error);
        throw error;
    }
}

export default createStripeCheckout;   