import { SupportedVexorPlatform } from "../methods";

export const vexorWebhook = (vexor: any) => {
    return Object.assign(
        // Generic webhook method
        (req: Request) => vexor.handleWebhook(req),
        // Platform-specific webhook methods
        {
            mercadopago: (req: Request) => vexor.handleWebhook(req),
            stripe: (req: Request) => vexor.handleWebhook(req),
            paypal: (req: Request) => vexor.handleWebhook(req),
        }
    );
}

export async function handleWebhook(vexor: any, req: Request): Promise<any> {
    const headers = req.headers;
    const body = await req.text();

    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.searchParams);

    // Detect the platform from the request headers
    let platform: SupportedVexorPlatform | undefined;

    if (headers.get('paypal-transmission-id')) {
        platform = 'paypal';
    } else if (headers.get('stripe-signature')) {
        platform = 'stripe';
    } else if (headers.get('referer')?.includes('mercadopago')) {
        platform = 'mercadopago';
    }

    if (!platform) {
        throw new Error('Unsupported payment platform or missing signature header');
    }

    if (!vexor.secretKey) {
        throw new Error('Missing VEXOR_SECRET_KEY environment variable');
    }

    // Create a new request object with the same method, headers, and body
    const forwardRequest = new Request(`${vexor.apiUrl}/webhooks/${platform}?${queryParams.toString()}`, {
        method: req.method,
        headers: new Headers(headers),
        body: body,
    });

    // Add Vexor-specific headers
    forwardRequest.headers.set('x-vexor-key', vexor.secretKey);
    forwardRequest.headers.set('x-vexor-platform', platform);
    forwardRequest.headers.set('x-vexor-project-id', vexor.projectId);

    // Send the request to the Vexor API
    const response = await fetch(forwardRequest);

    // Parse the JSON response
    const data = await response.json();

    // Return the webhook response data
    return data;
}

