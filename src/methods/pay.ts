import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { SupportedVexorPlatform, VexorPaymentBody, VexorPaymentResponse } from "@/methods";
import {
  createMercadoPagoCheckout,
  createStripeCheckout,
  createPaypalCheckout,
  createTaloCheckout,
  createSquareCheckout
} from "@/actions/checkouts";
import { VersionChecker } from "@/lib/version-validator";

export const vexorPay = (vexor: any) => {

  return Object.assign(
    // Generic payment method
    (params: { platform: SupportedVexorPlatform } & VexorPaymentBody) =>
      vexor.createCheckout(params.platform, params),
    // Platform-specific payment methods
    {
      mercadopago: (body: VexorPaymentBody) => vexor.createCheckout('mercadopago', body),
      stripe: (body: VexorPaymentBody) => vexor.createCheckout('stripe', body),
      paypal: (body: VexorPaymentBody) => vexor.createCheckout('paypal', body),
      talo: (body: VexorPaymentBody) => vexor.createCheckout('talo', body),
      square: (body: VexorPaymentBody) => vexor.createCheckout('square', body),
    }
  );
}

export async function createCheckout(vexor: any, platform: SupportedVexorPlatform, body: VexorPaymentBody): Promise<VexorPaymentResponse> {

  const isOpenSource = VersionChecker.isOpenSource(vexor);

  // Vexor Open Source
  if (isOpenSource) {

    let response: VexorPaymentResponse;

    // Call the platform-specific method
    switch (platform) {
      case SUPPORTED_PLATFORMS.MERCADO_PAGO.name:
        response = await createMercadoPagoCheckout(vexor, body);
        break;
      case SUPPORTED_PLATFORMS.STRIPE.name:
        response = await createStripeCheckout(vexor, body);
        break;
      case SUPPORTED_PLATFORMS.PAYPAL.name:
        response = await createPaypalCheckout(vexor, body);
        break;
      case SUPPORTED_PLATFORMS.TALO.name:
        response = await createTaloCheckout(vexor, body);
        break;
      case SUPPORTED_PLATFORMS.SQUARE.name:
        response = await createSquareCheckout(vexor, body);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return response;

  } else {

    // Vexor Cloud 
    const response = await fetch(`${vexor.apiUrl}/payments`, {
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
      throw new Error(`Payment request failed: ${errorMessage}`);
    }

    return data;
  }
}