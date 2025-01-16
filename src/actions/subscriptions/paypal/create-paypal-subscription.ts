import { formatInterval } from "@/lib/format-interval";
import { SUPPORTED_PLATFORMS } from "../../../lib/constants";
import { Vexor } from "../../../methods";
import { VexorSubscriptionBody } from "../../../types/requests";
import { generatePaypalAccessToken } from "../../authorizations/paypal/generate-paypal-access-token";
const createPaypalSubscription = async (
    vexor: Vexor,
    body: VexorSubscriptionBody
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

        // Create product
        // https://developer.paypal.com/docs/api/catalog-products/v1/
        const productUrl = `${API_URL}/v1/catalogs/products`;
        const productPayload = {
            name: body.name,
            description: body.description,
            type: 'SERVICE',
            category: 'SOFTWARE',
        };

        const productRes = await fetch(productUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(productPayload),
        });

        if (!productRes.ok) {
            throw new Error(`Failed to create product: ${productRes.statusText}`);
        }

        //console.log('PRODUCT CREATION RESPONSE', productRes);


        const productData = await productRes.json();

        //console.log('PRODUCT DATA', productData);

        const formattedInterval = formatInterval(body.interval, SUPPORTED_PLATFORMS.PAYPAL.name);

        // Create plan
        // https://developer.paypal.com/docs/api/subscriptions/v1/#plans_create
        const planUrl = `${API_URL}/v1/billing/plans`;
        const planPayload = {
            product_id: productData.id,
            name: body.name,
            description: body.description,
            billing_cycles: [
                {
                    frequency: {
                        interval_unit: formattedInterval,
                        interval_count: 1,
                    },
                    tenure_type: 'REGULAR',
                    sequence: 1,
                    total_cycles: 0,
                    pricing_scheme: {
                        fixed_price: {
                            value: body.price.toString(),
                            currency_code: body.currency,
                        },
                    },
                },
            ],
            payment_preferences: {
                auto_bill_outstanding: true,
                setup_fee: {
                    value: '0',
                    currency_code: body.currency,
                },
                setup_fee_failure_action: 'CONTINUE',
                payment_failure_threshold: 3,
            },
            taxes: {
                percentage: '0',
                inclusive: false,
            },
        };

        //console.log('PLAN PAYLOAD', planPayload);

        const planRes = await fetch(planUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'PayPal-Request-Id': planPayload.product_id,
                'Accept': 'application/json',
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
            body: JSON.stringify(planPayload),
        });

        //console.log('PLAN CREATION RESPONSE', planRes);

        if (!planRes.ok) {
            const errorData = await planRes.json();
            const errorDetails = errorData.details
            
            throw new Error(`Failed to create plan: ${JSON.stringify(errorDetails)}`);
        }

        const planData = await planRes.json();


        // Create subscription
        const subscriptionUrl = `${API_URL}/v1/billing/subscriptions`;
        const subscriptionPayload = {
            plan_id: planData.id,
            //start_time: new Date(Date.now() + 5 * 60000).toISOString(), // Start 5 minutes from now
            quantity: '1',
            application_context: {
                brand_name: body.name,
                locale: 'en-US',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                payment_method: {
                    payer_selected: 'PAYPAL',
                    payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
                },
                return_url: body.successRedirect,
                cancel_url: body.failureRedirect ?? `${body.successRedirect}?canceled=true`,
            },
            subscriber: {
                name: {
                    given_name: body.customer?.name?.split(' ')[0] ?? '',
                    surname: body.customer?.name?.split(' ')[1] ?? '',
                },
                email_address: body.customer?.email,
            },
        };

        const response = await fetch(subscriptionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "Prefer": "return=representation",
            },
            body: JSON.stringify(subscriptionPayload),
        });

        if (!response.ok) {
            throw new Error(`Failed to create subscription: ${response.statusText}`);
        }

        const subscriptionData = await response.json();


        if (response.ok) {
            const approveLink = subscriptionData.links.find((link: any) => link.rel === "approve");
            return {
                message: 'Paypal subscription created successfully',
                payment_url: approveLink.href as string,
                raw: subscriptionData,
                identifier: subscriptionData.id as string
            };

        } else {
            console.error("PayPal API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: subscriptionData,
                requestPayload: subscriptionPayload,
            });
            return {
                payment_url: '',
                message: subscriptionData.message || 'Failed to create PayPal subscription. Make sure that you are using the correct credentials for the environment. If your project is sandbox, make sure that you are using sandbox credentials. The identifier in this error is the paypal-debug-id',
                raw: subscriptionData.details || [],
                identifier: response.headers.get('paypal-debug-id') as string
            };
        }

    } catch (error) {
        console.error('Error creating Paypal subscription', error);
        throw error;
    }



}

export default createPaypalSubscription;   