import { isValidMercadoPagoSignature } from "@/actions/authorizations/mercadopago/verify-mercadopago-signature";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { VexorWebhookResponse } from "@/types/responses";
import crypto from "crypto";
export const handleMercadoPagoWebhook = async (vexor: any, req: any) => {

    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.searchParams);

    const data_id = queryParams.get("data.id");

    // This is used to validate notifications (only works in production environment)
    const x_signature = req.headers.get("x-signature");
    const x_request_id = req.headers.get("x-request-id");
    const body = await req.json();

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.mercadopago

        if (!platformCredentials) {
            throw new Error('MercadoPago credentials not found');
        }

        const mercadopagoAccessToken = platformCredentials.access_token
        const mercadopagoWebhookSecret = platformCredentials.webhook_secret

        if (!mercadopagoAccessToken) {
            throw new Error('MercadoPago access token not found');
        }

        if (!mercadopagoWebhookSecret) {
            throw new Error('MercadoPago webhook secret not found');
        }

        // Check if it's a sandbox or production environment
        const isSandbox = platformCredentials?.sandbox === true;
        const API_URL = isSandbox ? SUPPORTED_PLATFORMS.MERCADO_PAGO.base_url.sandbox : SUPPORTED_PLATFORMS.MERCADO_PAGO.base_url.production;


        if ((!isSandbox) && (!x_signature || !x_request_id || !data_id)) {
            console.log('Invalid request. The request does not contain the required headers.');
            return {
                message: 'Invalid request. The request does not contain the required headers.',
                status: 'error',
                transmissionId: x_request_id || '',
                identifier: '',
                timeStamp: new Date().toISOString(),
                orderId: '',
                eventType: '',
                platform: SUPPORTED_PLATFORMS.MERCADO_PAGO.name,
                resource: null,
            } as VexorWebhookResponse
        }

        // Check if the signature is valid in production environment
        if ((body.live_mode || !isSandbox)) {

            const isValidSignature = isValidMercadoPagoSignature({
                x_signature,
                mercadopagoWebhookSecret,
                data_id: data_id as string,
                x_request_id
            });

            if (!isValidSignature) {
                throw new Error('Invalid signature');
            }
        }

        let payment_url

        switch (body.entity) {
            case 'preapproval_plan':
                payment_url = `https://api.mercadopago.com/preapproval_plan/${body.data.id}`
                break;
            case 'preapproval':
                payment_url = `https://api.mercadopago.com/preapproval/${body.data.id}`
                break;
            default:
                payment_url = `https://api.mercadopago.com/v1/payments/${body.data.id}`
                break;
        }

        // Get payment information
        const payment_response = await fetch(payment_url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${mercadopagoAccessToken}`
            }
        });

        let payment_data = await payment_response.json();
        let identifier = ''
        let responseMessage = 'Event processed';
        let status = 'pending'

        console.log('PAYMENT DATA', payment_data);

        switch (body.action) {

            case 'payment.created':
                //console.log('Payment created with mercadopago transaction id:', body.data.id);
                responseMessage = 'Payment created with mercadopago transaction id: ' + body.data.id;
                identifier = payment_data.metadata?.identifier || payment_data.external_reference || ''


                // =============================
                // ===💳==== CHECKOUTS ====💳===
                // =============================

                // Check if the payment is approved
                if (payment_data.status === 'approved') {
                    status = 'paid'
                }


                // =================================
                // ===🔄==== SUBSCRIPTIONS ====🔄===
                // =================================

                // Check if the payment is a subscription
                if (payment_data.point_of_interaction?.type === 'SUBSCRIPTIONS') {
                    // Get payment information
                    const subscription_response = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${mercadopagoAccessToken}`
                        }
                    });

                    const subscription_data = await subscription_response.json();

                    // Get preapproval information
                    const preapproval_response = await fetch(`https://api.mercadopago.com/preapproval/${subscription_data.metadata.preapproval_id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${mercadopagoAccessToken}`
                        }
                    });

                    const preapproval_data = await preapproval_response.json();
                    responseMessage = 'Subscription created with mercadopago transaction id: ' + body.data.id;
                    identifier = preapproval_data.metadata?.identifier || preapproval_data.external_reference || ''
                }

                break;
            case 'payment.updated':

                //console.log('Payment updated with mercadopago transaction id:', body.data.id);
                responseMessage = 'Payment updated with mercadopago transaction id: ' + body.data.id;
                if (payment_data.status) {
                    status = payment_data.status
                }
                identifier = payment_data.metadata?.identifier || payment_data.external_reference || ''
                break;
            case 'created':

                //console.log('Subscription preapproval created with mercadopago transaction id:', body.data.id);
                responseMessage = 'Subscription preapproval created with mercadopago transaction id: ' + body.data.id;
                identifier = payment_data.metadata?.identifier || payment_data.external_reference || ''
                if (payment_data.status) {
                    status = payment_data.status
                }
                if (body.entity !== 'preapproval_plan' && body.entity !== 'preapproval') {

                    if (body.entity === 'authorized_payment') {
                        // Get preapproval information
                        const authorized_payment_response = await fetch(`https://api.mercadopago.com/authorized_payments/${body.data.id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${mercadopagoAccessToken}`
                            }
                        });

                        const authorized_payment = await authorized_payment_response.json();

                        responseMessage = `Subscription payment authorization created with ID: ${body.data.id}. \nDebit date: ${new Date(authorized_payment.debit_date).toLocaleDateString()}`;
                        identifier = authorized_payment.metadata?.identifier || authorized_payment.external_reference || ''
                        payment_data = authorized_payment
                        status = authorized_payment.status

                    } else {
                        // Get preapproval information
                        const no_entity_response = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${mercadopagoAccessToken}`
                            }
                        });


                        const no_entity_data = await no_entity_response.json();

                        if (no_entity_data.status === 404) {
                            status = 'pending'
                            responseMessage = 'Subscription preapproval created with mercadopago transaction id: ' + body.data.id + ' but the subscription was not found in Mercadopago. This may occur if the user has not paid yet, even though, mercadopago emits an update. ⚠️ THIS RESPONSE WILL NOT CONTAIN ANY IDENTIFIER.'
                        }

                        console.log('PREAPPROVAL DATA', no_entity_data);

                        identifier = no_entity_data.metadata?.identifier || no_entity_data.external_reference || ''
                        payment_data = no_entity_data
                    }


                }
                break;

            case 'updated':

                responseMessage = 'Subscription updated with mercadopago transaction id: ' + body.data.id;
                //console.log('PAYMENT DATA', payment_data);
                if (payment_data.status) {
                    status = payment_data.status
                }
                identifier = payment_data.metadata?.identifier || payment_data.external_reference || ''
                if (payment_data.status === 404) {
                    status = 'pending'
                    responseMessage = 'Subscription update received with mercadopago transaction id: ' + body.data.id + ' but the subscription was not found in Mercadopago. This may occur if the user has not paid yet, even though, mercadopago emits an update. ⚠️ THIS RESPONSE WILL NOT CONTAIN ANY IDENTIFIER.'
                }

                if (payment_data.status === 'authorized' && payment_data.next_payment_date > new Date()) {
                    status = payment_data.status
                }
                identifier = payment_data.metadata?.identifier || payment_data.external_reference || ''
                break;
            default:
                console.error('Unhandled event type:', body.action);

                responseMessage = 'Mercadopago events supported: payment.created, created, updated, payment.updated'
        }



        return {
            message: responseMessage,
            status: status,
            transmissionId: x_request_id || '',
            identifier: identifier,
            timeStamp: new Date().toISOString(),
            orderId: body.data.id as string,
            eventType: body.action as string,
            platform: SUPPORTED_PLATFORMS.MERCADO_PAGO.name,
            resource: payment_data,
        } as VexorWebhookResponse

    } catch (error) {
        console.error(error);
        return {
            message: 'Error processing MercadoPago webhook',
            status: 'error',
            transmissionId: x_request_id || '',
            identifier: '',
            timeStamp: new Date().toISOString(),
            orderId: '',
            eventType: '',
            platform: SUPPORTED_PLATFORMS.MERCADO_PAGO.name,
            resource: null,
        } as VexorWebhookResponse
    }
}

