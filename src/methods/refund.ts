import { VersionChecker } from "@/lib/version-validator";
import { SupportedVexorPlatform, VexorRefundBody, VexorRefundResponse } from "../methods";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import refundMercadoPagoPayment from "@/actions/refunds/mercadopago/refund-mercadopago-payment";
import refundStripePayment from "@/actions/refunds/stripe/refund-stripe-payment";
import refundPaypalPayment from "@/actions/refunds/paypal/refund-paypal-payment";

export const vexorRefund = (vexor: any) => {
    return Object.assign(
        // Generic refund method
        (params: { platform: SupportedVexorPlatform } & VexorRefundBody) =>
            vexor.createRefund(params.platform, params),
        // Platform-specific refund methods
        {
            mercadopago: (body: VexorRefundBody) => vexor.createRefund('mercadopago', body),
            stripe: (body: VexorRefundBody) => vexor.createRefund('stripe', body),
            paypal: (body: VexorRefundBody) => vexor.createRefund('paypal', body),
        }
    );
}

export async function createRefund(vexor: any, platform: SupportedVexorPlatform, body: VexorRefundBody): Promise<VexorRefundResponse> {


    const isOpenSource = VersionChecker.isOpenSource(vexor);

    // Vexor Open Source
    if (isOpenSource) {

        let response: VexorRefundResponse;

        // Call the platform-specific method
        switch (platform) {
            case SUPPORTED_PLATFORMS.MERCADO_PAGO.name:
                response = await refundMercadoPagoPayment(vexor, body);
                break;
            case SUPPORTED_PLATFORMS.STRIPE.name:
                response = await refundStripePayment(vexor, body);
                break;
            case SUPPORTED_PLATFORMS.PAYPAL.name:
               response = await refundPaypalPayment(vexor, body);
               break;
           /*  case SUPPORTED_PLATFORMS.TALO.name:
               response = await createTaloCheckout(vexor, body);
               break;
             case SUPPORTED_PLATFORMS.SQUARE.name:
               response = await createSquareCheckout(vexor, body);
               break; */
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }

        return response;

    } else {

        // Vexor Cloud

        const response = await fetch(`${vexor.apiUrl}/refunds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-vexor-key': vexor.secretKey,
                'x-vexor-platform': platform,
                'x-vexor-project-id': vexor.projectId,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.message || 'An unknown error occurred';
            throw new Error(`Refund request failed: ${errorMessage}`);
        }

        return data;
    }
}