import { MercadoPagoConfig, PreApprovalPlan } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import { Vexor } from "@/methods";
import { VexorSubscriptionBody } from "@/types/requests";
import { formatInterval } from '@/lib/format-interval';
import { SUPPORTED_PLATFORMS } from '@/lib/constants';

const createMercadoPagoSubscription= async (
    vexor: Vexor,
    body: VexorSubscriptionBody
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

        const formattedInterval = formatInterval(body.interval, SUPPORTED_PLATFORMS.MERCADO_PAGO.name);


        const client = new MercadoPagoConfig({
            accessToken: mercadopagoAccessToken,
        });
        const subscription = new PreApprovalPlan(client);

        const identifier = uuidv4();


        const subscriptionBody = {
            reason: body.name,
            auto_recurring: {
                frequency: 1,
                frequency_type: formattedInterval,
                transaction_amount: body.price,
                currency_id: body.currency
            },
            payment_methods_allowed: {
                payment_types: [
                    {
                        id: 'credit_card'
                    }
                ],
                payment_methods: [
                    {
                        id: 'credit_card'
                    }
                ]
            },
            back_url: body.successRedirect,
            external_reference: identifier,
            status: 'active',
        };

        const result = await subscription.create({
            body: subscriptionBody
        });

        return {
            message: 'Mercadopago subscription created',
            payment_url: result.init_point as string,
            raw: result,
            identifier
        }

    } catch (error) {
        console.error('Error creating MercadoPago subscription', error);
        throw error;
    }
}

export default createMercadoPagoSubscription;   