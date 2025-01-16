import { createMercadoPagoSubscription, createPaypalSubscription } from "@/actions/subscriptions";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { VersionChecker } from "@/lib/version-validator";
import { SupportedVexorPlatform } from "@/types/platforms";
import { VexorSubscriptionBody } from "@/types/requests";
import {
    VexorPaymentResponse,
    VexorSubscriptionResponse
} from "@/types/responses";

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

    const isOpenSource = VersionChecker.isOpenSource(vexor);

    // Vexor Open Source
    if (isOpenSource) {
        let response: VexorSubscriptionResponse;

        // Call the platform-specific method
        switch (platform) {
            case SUPPORTED_PLATFORMS.MERCADO_PAGO.name:
                response = await createMercadoPagoSubscription(vexor, body);
                break;
            case SUPPORTED_PLATFORMS.STRIPE.name:
                response = await createMercadoPagoSubscription(vexor, body);
                break;
            case SUPPORTED_PLATFORMS.PAYPAL.name:
                response = await createPaypalSubscription(vexor, body);
                break;
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }

        return response;

    } else {
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


}

