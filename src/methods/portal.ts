import { SupportedVexorPlatform, VexorPortalBody, VexorPortalResponse } from "../methods";

export const vexorPortal = (vexor: any) => {
    return Object.assign(
        // Generic portal method
        (params: { platform: SupportedVexorPlatform } & VexorPortalBody) =>
            vexor.createPortal(params.platform, params),
        // Platform-specific portal methods
        {
            mercadopago: (body: VexorPortalBody) => vexor.createPortal('mercadopago', body),
            stripe: (body: VexorPortalBody) => vexor.createPortal('stripe', body),
            paypal: (body: VexorPortalBody) => vexor.createPortal('paypal', body),
        }
    );
}

export async function createPortal(vexor: any, platform: SupportedVexorPlatform, body: VexorPortalBody): Promise<VexorPortalResponse> {
    const response = await fetch(`${vexor.apiUrl}/portals`, {
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
        throw new Error(`Portal request failed: ${errorMessage}`);
    }

    return data;
}

