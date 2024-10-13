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

interface VexorPortalBody {
  customerId?: string;
  orderId?: string;
  returnUrl: string;
}

interface VexorSubscriptionBody {
  name: string;
  description?: string;
  interval: string;
  price: number;
  currency: string;
  successRedirect: string;
  failureRedirect?: string;
  customer?: {
    email: string;
    name?: string;
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

// Define the structure for portal response
interface VexorPortalResponse {
  message: string;
  result: {
    portal_url: string;
    raw?: any;
  };
}

// Define the structure for Vexor constructor parameters
interface VexorParams {
  publishableKey: string;
  projectId: string;
  secretKey?: string;
}

// Main Vexor class for handling payments
class Vexor {
  // Singleton instance of Vexor
  private static instance: Vexor | null = null;
  private publishableKey: string;
  private secretKey?: string;
  private projectId: string;
  private apiUrl: string = "http://localhost:3000/api";

  // Constructor to initialize Vexor with parameters object
  constructor(params: VexorParams) {
    this.publishableKey = params.publishableKey;
    this.secretKey = params.secretKey;
    this.projectId = params.projectId;
  }

  // Create a Vexor instance using environment variables
  static fromEnv(): Vexor {
    if (!Vexor.instance) {
      const publishableKey = process.env.NEXT_PUBLIC_VEXOR_KEY;
      const secretKey = process.env.VEXOR_SECRET_KEY;
      const projectId = process.env.NEXT_PUBLIC_VEXOR_PROJECT;
      if (!publishableKey) {
        throw new Error('Missing NEXT_PUBLIC_VEXOR_KEY environment variable');
      }
      if (!projectId) {
        throw new Error('Missing NEXT_PUBLIC_VEXOR_PROJECT environment variable');
      }
      Vexor.instance = new Vexor({ publishableKey, projectId, secretKey });
    }
    return Vexor.instance;
  }

  // Create a Vexor instance with provided parameters
  static init(params: VexorParams): Vexor {
    return new Vexor(params);
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
        'x-vexor-key': this.publishableKey,
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
  // vexor.webhook                        [START]
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

    if (!this.secretKey) {
      throw new Error('Missing VEXOR_SECRET_KEY environment variable');
    }

    // Create a new request object with the same method, headers, and body
    const forwardRequest = new Request(`${this.apiUrl}/webhooks/${platform}?${queryParams.toString()}`, {
      method: req.method,
      headers: new Headers(headers),
      body: body,
    });

    // Add Vexor-specific headers
    forwardRequest.headers.set('x-vexor-key', this.secretKey);
    forwardRequest.headers.set('x-vexor-platform', platform);
    forwardRequest.headers.set('x-vexor-project-id', this.projectId);

    // Supported events
    const supportedEvents = []

    // Send the request to the Vexor API
    const response = await fetch(forwardRequest);

    // Parse the JSON response
    const data = await response.json();

  /*   // Check if the request was successful
    if (!response.ok) {
      const statusCode = response.status;
      const errorMessage = data.error?.message || data.message || data.error.toString() || 'An unknown error occurred';
      throw new Error(`Webhook request failed with code ${statusCode} - ${errorMessage}`);
    } */

    // Return the webhook response data
    return data;
  }

  // ============================================
  // vexor.webhook                          [END]
  // ============================================


  // ========================================================
  // vexor.subscribe and vexor.subscribe.platform     [START]
  // ========================================================
  /**
   * Subscription method with platform-specific shortcuts.
   * @type {Object}
   * @property {Function} mercadopago - Shortcut for MercadoPago subscriptions.
   * @property {Function} stripe - Shortcut for Stripe subscriptions.
   * @property {Function} paypal - Shortcut for PayPal subscriptions.
   * 
   * @example
   * // Generic usage
   * vexor.subscribe({ platform: 'mercadopago', body });
   * 
   * // Platform-specific shortcut
   * vexor.subscribe.mercadopago({ body });
   * 
   * @description
   * Facilitates simple subscription scenarios for various payment platforms.
   */
  subscribe = Object.assign(
    // Generic subscription method
    (params: { platform: SupportedVexorPlatform } & VexorSubscriptionBody) =>
      this.createSubscription(params.platform, params),
    // Platform-specific subscription methods
    {
      mercadopago: (body: VexorSubscriptionBody) => this.createSubscription('mercadopago', body),
      stripe: (body: VexorSubscriptionBody) => this.createSubscription('stripe', body),
      paypal: (body: VexorSubscriptionBody) => this.createSubscription('paypal', body),
    }
  );

  // Private method to create a checkout session
  private async createSubscription(platform: SupportedVexorPlatform, body: VexorSubscriptionBody): Promise<VexorPaymentResponse> {
    // Send a POST request to the Vexor API
    const response = await fetch(`${this.apiUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vexor-key': this.publishableKey,
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
  // ========================================================
  // vexor.subscribe and vexor.subscribe.platform       [END]
  // ========================================================

  // ========================================================
  // vexor.portal and vexor.portal.platform     [START]
  // ========================================================
  /**
   * Billing portal method with platform-specific shortcuts.
   * @type {Object}
   * @property {Function} mercadopago - Shortcut for MercadoPago portals.
   * @property {Function} stripe - Shortcut for Stripe portals.
   * @property {Function} paypal - Shortcut for PayPal portals.
   * 
   * @example
   * // Generic usage
   * vexor.subscribe({ platform: 'mercadopago', body });
   * 
   * // Platform-specific shortcut
   * vexor.subscribe.mercadopago({ body });
   * 
   * @description
   * Facilitates simple subscription scenarios for various payment platforms.
   */
  portal = Object.assign(
    // Generic portal method
    (params: { platform: SupportedVexorPlatform } & VexorPortalBody) =>
      this.createPortal(params.platform, params),
    // Platform-specific portal methods
    {
      mercadopago: (body: VexorPortalBody) => this.createPortal('mercadopago', body),
      stripe: (body: VexorPortalBody) => this.createPortal('stripe', body),
      paypal: (body: VexorPortalBody) => this.createPortal('paypal', body),
    }
  );

  // Private method to create a checkout session
  private async createPortal(platform: SupportedVexorPlatform, body: VexorPortalBody): Promise<VexorPortalResponse> {
    // Send a POST request to the Vexor API
    const response = await fetch(`${this.apiUrl}/portals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vexor-key': this.publishableKey,
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
  // ========================================================
  // vexor.subscribe and vexor.subscribe.platform       [END]
  // ========================================================




}

// Export the Vexor class as a named export instead of default
export { Vexor };

// Also export the types and interfaces
export type { 
  SupportedVexorPlatform, 
  VexorPaymentBody, 
  VexorPaymentResponse, 
  VexorParams, 
  VexorPortalResponse, 
  VexorPortalBody 
};