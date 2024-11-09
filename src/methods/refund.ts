import { SupportedVexorPlatform, VexorRefundBody, VexorRefundResponse } from "../methods";

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
