import { SupportedVexorPlatform, VexorSubscriptionBody, VexorPaymentResponse } from "../methods";

export const vexorSubscribe = (vexor: any) => {
    return Object.assign(
        // Generic subscription method
        (params: { platform: SupportedVexorPlatform } & VexorSubscriptionBody) =>
            vexor.createSubscription(params.platform, params),
        // Platform-specific subscription methods
        {
            mercadopago: (body: VexorSubscriptionBody) => vexor.createSubscription('mercadopago', body),
            stripe: (body: VexorSubscriptionBody) => vexor.createSubscription('stripe', body),
            paypal: (body: VexorSubscriptionBody) => vexor.createSubscription('paypal', body),
        }
    );
}

export async function createSubscription(vexor: any, platform: SupportedVexorPlatform, body: VexorSubscriptionBody): Promise<VexorPaymentResponse> {
    const response = await fetch(`${vexor.apiUrl}/subscriptions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-vexor-key': vexor.publishableKey,
            'x-vexor-platform': platform,
            'x-vexor-project-id': vexor.projectId,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.message || 'An unknown error occurred';
        throw new Error(`Subscription request failed: ${errorMessage}`);
    }

    return data;
}

