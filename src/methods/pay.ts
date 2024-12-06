import { SupportedVexorPlatform, VexorPaymentBody, VexorPaymentResponse } from "../methods";

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