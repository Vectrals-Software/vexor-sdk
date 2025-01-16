import { VexorPaymentBody } from "../../../types/requests";
import { Vexor } from "../../../methods";
import { v4 as uuidv4 } from 'uuid';
import { generatePaypalAccessToken } from "../../authorizations/paypal/generate-paypal-access-token";
import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
const createPaypalCheckout = async (
    vexor: Vexor,
    body: VexorPaymentBody
) => {

    try {

        // Get the platform credentials
        const platformCredentials = vexor.platforms?.paypal

        if (!platformCredentials) {
            throw new Error('Paypal credentials not found');
        }

        const paypalSecretKey = platformCredentials.secret_key

        if (!paypalSecretKey) {
            throw new Error('Paypal secret key not found');
        }

        const paypalClientId = platformCredentials.client_id

        if (!paypalClientId) {
            throw new Error('Paypal client id not found');
        }

        // Check if it's a sandbox or production environment
        const isSandbox = platformCredentials?.sandbox === true;
        const API_URL = isSandbox ? SUPPORTED_PLATFORMS.PAYPAL.base_url.sandbox : SUPPORTED_PLATFORMS.PAYPAL.base_url.production;



        // Generate the access token
        const accessToken = await generatePaypalAccessToken(paypalClientId, paypalSecretKey, API_URL);

        // Make the API call to Paypal
        const url = `${API_URL}/v2/checkout/orders`;

        const itemsWithAmounts = body.items.map(item => ({
            name: item.title,
            unit_amount: {
                currency_code: body.options?.currency || "USD",
                value: item.unit_price.toFixed(2),
            },
            //custom_id: 
            quantity: item.quantity.toString(),
            description: item.description || `${item.title} - ${item.quantity} unit(s)`,
        }));

        const itemTotal = itemsWithAmounts.reduce(
            (sum, item) => sum + parseFloat(item.unit_amount.value) * parseInt(item.quantity),
            0
        );

        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: body.options?.currency || "USD",
                        value: itemTotal.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: body.options?.currency || "USD",
                                value: itemTotal.toFixed(2),
                            },
                        },
                    },
                    items: itemsWithAmounts,
                },
            ],
            application_context: {
                return_url: body.options?.successRedirect || 'http://localhost:3000',
                cancel_url: body.options?.failureRedirect || 'http://localhost:3000',
            },
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });


        const jsonResponse = await response.json();


        if (response.ok) {
            const approveLink = jsonResponse.links.find((link: any) => link.rel === "approve");
            return {
                message: 'Paypal checkout created successfully',
                payment_url: approveLink.href as string,
                raw: jsonResponse,
                identifier: jsonResponse.id as string
            };

        } else {
            console.error("PayPal API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: jsonResponse,
                requestPayload: payload,
            });
            return {
                payment_url: '',
                message: jsonResponse.message || 'Failed to create PayPal order. Make sure that you are using the correct credentials for the environment. If your project is sandbox, make sure that you are using sandbox credentials. The identifier in this error is the paypal-debug-id',
                raw: jsonResponse.details || [],
                identifier: response.headers.get('paypal-debug-id') as string
            };
        }

    } catch (error) {
        console.error('Error creating Paypal checkout', error);
        throw error;
    }



}

export default createPaypalCheckout;   