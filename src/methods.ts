// Define the supported payment platforms
type SupportedVexorPlatform = 'mercadopago' | 'stripe' | 'paypal';


// Define the structure for payment request body
interface VexorPaymentBody {
  items: Array<{
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
  }>;
  options?: {
    successRedirect?: string;
    pendingRedirect?: string;
    failureRedirect?: string;
  };
}

// Define the structure for payment response
interface VexorPaymentResponse {
  message: string;
  result: {
    payment_url: string;
    identifier: string;
    raw: any;
  };
}

// Main Vexor class for handling payments
class Vexor {
  // Singleton instance of Vexor
  private static instance: Vexor | null = null;
  private apiKey: string;
  private apiSecret?: string;
  private projectId: string;
  private apiUrl: string = "http://localhost:3000/api";

  // Constructor to initialize Vexor with an API key
  constructor(apiKey: string, projectId: string, apiSecret?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.projectId = projectId;
  }

  // Create a Vexor instance using environment variables
  static fromEnv(): Vexor {
    if (!Vexor.instance) {
      const apiKey = process.env.NEXT_PUBLIC_VEXOR_KEY;
      const apiSecret = process.env.VEXOR_SECRET_KEY;
      const projectId = process.env.NEXT_PUBLIC_VEXOR_PROJECT;
      if (!apiKey) {
        throw new Error('Missing NEXT_PUBLIC_VEXOR_KEY environment variable');
      }
      if (!projectId) {
        throw new Error('Missing NEXT_PUBLIC_VEXOR_PROJECT environment variable');
      }
      Vexor.instance = new Vexor(apiKey, projectId, apiSecret);
    }
    return Vexor.instance;
  }

  // Create a Vexor instance with a provided API key
  static init(apiKey: string, projectId: string, apiSecret: string): Vexor {
    return new Vexor(apiKey, projectId, apiSecret);
  }

  // ============================================
  // vexor.pay and vexor.pay.platform     [START]
  // ============================================
  /**
   * Pay method with platform-specific shortcuts.
   * @type {Object}
   * @property {Function} mercadopago - Shortcut for MercadoPago payments.
   * @property {Function} stripe - Shortcut for Stripe payments.
   * @property {Function} paypal - Shortcut for PayPal payments.
   * 
   * @example
   * // Generic usage
   * vexor.pay({ platform: 'mercadopago', items: [...] });
   * 
   * // Platform-specific shortcut
   * vexor.pay.mercadopago({ items: [...] });
   * 
   * @description
   * Facilitates simple checkout scenarios for various payment platforms.
   */
  pay = Object.assign(
    // Generic payment method
    (params: { platform: SupportedVexorPlatform } & VexorPaymentBody) =>
      this.createCheckout(params.platform, params),
    // Platform-specific payment methods
    {
      mercadopago: (body: VexorPaymentBody) => this.createCheckout('mercadopago', body),
      stripe: (body: VexorPaymentBody) => this.createCheckout('stripe', body),
      paypal: (body: VexorPaymentBody) => this.createCheckout('paypal', body),
    }
  );

  // Private method to create a checkout session
  private async createCheckout(platform: SupportedVexorPlatform, body: VexorPaymentBody): Promise<VexorPaymentResponse> {
    // Send a POST request to the Vexor API
    const response = await fetch(`${this.apiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vexor-key': this.apiKey,
        'x-vexor-platform': platform,
        'x-vexor-project-id': this.projectId,
      },
      body: JSON.stringify(body),
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      const errorMessage = data.message || 'An unknown error occurred';
      throw new Error(`Payment request failed: ${errorMessage}`);
    }

    // Return the payment response data
    return data;
  }
  // ============================================
  // vexor.pay and vexor.pay.platform       [END]
  // ============================================


  // ============================================
  // vexor.webhook     [START]
  // ============================================
  /**
     * Webhook method with platform-specific shortcuts.
     * @type {Object}
     * @property {Function} mercadopago - Shortcut for MercadoPago webhooks.
     * @property {Function} stripe - Shortcut for Stripe webhooks.
     * @property {Function} paypal - Shortcut for PayPal webhooks.
     * 
     * @example
     * // Generic usage
     * vexor.webhook(req);
     * 
     * // Platform-specific shortcut
     * vexor.webhook.mercadopago(req);
     * 
     * @description
     * Facilitates webhook handling for various payment platforms.
     */
  webhook = Object.assign(
    // Generic webhook method
    (req: Request) => this.handleWebhook(req),
    // Platform-specific webhook methods
    {
      mercadopago: (req: Request) => this.handleWebhook(req),
      stripe: (req: Request) => this.handleWebhook(req),
      paypal: (req: Request) => this.handleWebhook(req),
    }
  );

  // Private method to handle webhooks
  private async handleWebhook(req: Request): Promise<any> {
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

    if (!this.apiSecret) {
      throw new Error('Missing VEXOR_SECRET_KEY environment variable');
    }

    // Create a new request object with the same method, headers, and body
    const forwardRequest = new Request(`${this.apiUrl}/webhooks/${platform}?${queryParams.toString()}`, {
      method: req.method,
      headers: new Headers(headers),
      body: body,
    });

    // Add Vexor-specific headers
    forwardRequest.headers.set('x-vexor-key', this.apiSecret);
    forwardRequest.headers.set('x-vexor-platform', platform);
    forwardRequest.headers.set('x-vexor-project-id', this.projectId);

    // Send the request to the Vexor API
    const response = await fetch(forwardRequest);

    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      const errorMessage = data.message || 'An unknown error occurred';
      throw new Error(`Webhook request failed: ${errorMessage}`);
    }

    // Return the webhook response data
    return data;
  }

}

// Export the Vexor class as a named export instead of default
export { Vexor };

// Also export the types and interfaces
export type { SupportedVexorPlatform, VexorPaymentBody, VexorPaymentResponse };