import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { VersionChecker } from "@/lib/version-validator";
import { SupportedVexorPlatform } from "@/methods";
import { 
    handleMercadoPagoWebhook,
    handleStripeWebhook,
    handlePaypalWebhook,
    handleTaloWebhook,
    handleSquareWebhook
} from "@/actions/webhooks/index";
import { VexorWebhookResponse } from "@/types/responses";

export const vexorWebhook = (vexor: any) => {
    return Object.assign(
        // Generic webhook method
        (req: Request) => vexor.handleWebhook(req),
        // Platform-specific webhook methods
        {
            mercadopago: (req: Request) => vexor.handleWebhook(req),
            stripe: (req: Request) => vexor.handleWebhook(req),
            paypal: (req: Request) => vexor.handleWebhook(req),
            talo: (req: Request) => vexor.handleWebhook(req),
            square: (req: Request) => vexor.handleWebhook(req),
        }
    );
}

export async function handleWebhook(vexor: any, req: Request): Promise<any> {
    const headers = req.headers;

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
    } else if (queryParams.get('vexorPlatform') === 'talo') {
        platform = 'talo';
    } else if (headers.get('x-square-hmacsha256-signature')) {
        platform = 'square';
    }

    if (!platform) {
        throw new Error('Unsupported payment platform or missing signature header');
    }

    const isOpenSource = VersionChecker.isOpenSource(vexor);

    if (isOpenSource) {
        let response: VexorWebhookResponse;

        // Call the platform-specific method
        switch (platform) {
          case SUPPORTED_PLATFORMS.MERCADO_PAGO.name:
            response = await handleMercadoPagoWebhook(vexor, req);
            break;
          case SUPPORTED_PLATFORMS.STRIPE.name:
            response = await handleStripeWebhook(vexor, req);
            break;
          case SUPPORTED_PLATFORMS.PAYPAL.name:
            response = await handlePaypalWebhook(vexor, req);
            break;
          case SUPPORTED_PLATFORMS.TALO.name:
            response = await handleTaloWebhook(vexor, req);
            break;
          case SUPPORTED_PLATFORMS.SQUARE.name:
            response = await handleSquareWebhook(vexor, req);
            break;
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }
    
        return response;
    } else {

        // Vexor Cloud
        const body = await req.text();

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
}

