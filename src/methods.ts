import { createCheckout, vexorPay } from "./methods/pay";
import { handleWebhook, vexorWebhook } from "./methods/webhook";
import { createSubscription, vexorSubscribe } from "./methods/subscribe";
import { createPortal, vexorPortal } from "./methods/portal";
import { createConnect, createConnectAuth, createConnectPay, createConnectDashboard, vexorConnect } from "./methods/connect";
import { createRefund, vexorRefund } from "./methods/refund";

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
  identifier: string;
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
  payment_url: string;
  identifier: string;
  raw: any;
}

// Define the structure for subscription response
interface VexorSubscriptionResponse {
  message: string;
  payment_url: string;
  identifier: string;
  raw: any;
}

// Define the structure for portal response
interface VexorPortalResponse {
  message: string;
  portal_url: string;
  raw?: any;
}

// Define the structure for Vexor constructor parameters
interface VexorParams {
  publishableKey: string;
  projectId: string;
  secretKey?: string;
}

interface VexorConnectBody {
  redirectUrl: string;
  countryCode?: string;
  express?: boolean;
}

interface VexorConnectAuthBody {
  redirectUrl: string;
  mp_state_key: string;
  mp_code: string;
}

interface VexorConnectPayBody {
  redirectUrl: string;
  seller: {
    access_token: string;
    fee?: string | number;
  };
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

interface VexorConnectDashboardBody {
  connectedAccountId: string;
}

interface VexorConnectResponse {
  message: string;
  result: {
    connect_url?: string;
    payment_url?: string;
    dashboard_url?: string;
    identifier: string;
    raw: any;
  };
}

// Add these interfaces with the existing interfaces
interface VexorRefundBody {
    identifier: string;
}

interface VexorRefundResponse {
    message: string;
    refund_response: any;
    identifier: string;
    error?: any;
}

// Main Vexor class for handling payments
class Vexor {
  // Singleton instance of Vexor
  private static instance: Vexor | null = null;
  private publishableKey: string;
  private secretKey?: string;
  private projectId: string;
  private apiUrl: string = "https://www.vexorpay.com/api";
  //private apiUrl: string = "http://localhost:3000/api";


  // Constructor to initialize Vexor with parameters object
  constructor(params: VexorParams) {
    this.publishableKey = params.publishableKey;
    this.secretKey = params.secretKey;
    this.projectId = params.projectId;
    this.pay = vexorPay(this);
    this.webhook = vexorWebhook(this);
    this.subscribe = vexorSubscribe(this);
    this.portal = vexorPortal(this);
    this.connect = vexorConnect(this);
    this.refund = vexorRefund(this);
  }

  // Create a Vexor instance using environment variables
  static fromEnv(): Vexor {
    if (!Vexor.instance) {
      const publishableKey = process.env.NEXT_PUBLIC_VEXOR_PUBLISHABLE_KEY || process.env.VEXOR_PUBLISHABLE_KEY;
      const secretKey = process.env.VEXOR_SECRET_KEY;
      const projectId = process.env.NEXT_PUBLIC_VEXOR_PROJECT || process.env.VEXOR_PROJECT;
      if (!publishableKey) {
        throw new Error('Missing environment variable for publishable key');
      }
      if (!projectId) {
        throw new Error('Missing environment variable for project ID');
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

  pay: ReturnType<typeof vexorPay>
  createCheckout(platform: SupportedVexorPlatform, body: VexorPaymentBody): Promise<VexorPaymentResponse> {
    return createCheckout(this, platform, body);
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
  webhook: ReturnType<typeof vexorWebhook>;

  handleWebhook(req: Request): Promise<any> {
    return handleWebhook(this, req);
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
  subscribe: ReturnType<typeof vexorSubscribe>;

  createSubscription(platform: SupportedVexorPlatform, body: VexorSubscriptionBody): Promise<VexorSubscriptionResponse> {
    return createSubscription(this, platform, body);
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
   * vexor.portal({ platform: 'mercadopago', body });
   * 
   * // Platform-specific shortcut
   * vexor.portal.mercadopago({ body });
   * 
   * @description
   * Facilitates creation of billing portals for various payment platforms.
   */
  portal: ReturnType<typeof vexorPortal>;

  createPortal(platform: SupportedVexorPlatform, body: VexorPortalBody): Promise<VexorPortalResponse> {
    return createPortal(this, platform, body);
  }
  // ========================================================
  // vexor.portal and vexor.portal.platform       [END]
  // ========================================================

  // ========================================================
  // vexor.connect and related methods              [START]
  // ========================================================
  /**
   * Connect method with platform-specific shortcuts.
   * @type {Object}
   * @property {Function} mercadopago - Shortcut for MercadoPago connect.
   * @property {Function} stripe - Shortcut for Stripe connect.
   * @property {Function} auth - Shortcut for MercadoPago auth.
   * @property {Object} pay - Object with payment methods for connected accounts.
   * @property {Function} dashboard - Shortcut for Stripe dashboard link.
   * 
   * @example
   * // Generic usage
   * vexor.connect({ platform: 'stripe', redirectUrl: 'www.example.com', countryCode: 'US', express: true });
   * 
   * // Platform-specific shortcut
   * vexor.connect.mercadopago({ redirectUrl: 'www.example.com', countryCode: 'AR' });
   * 
   * @description
   * Facilitates account connection for various payment platforms.
   */
  connect: ReturnType<typeof vexorConnect>;

  createConnect(platform: SupportedVexorPlatform, body: VexorConnectBody): Promise<VexorConnectResponse> {
    return createConnect(this, platform, body);
  }

  createConnectAuth(body: VexorConnectAuthBody): Promise<VexorConnectResponse> {
    return createConnectAuth(this, body);
  }

  createConnectPay(platform: SupportedVexorPlatform, body: VexorConnectPayBody): Promise<VexorConnectResponse> {
    return createConnectPay(this, platform, body);
  }

  createConnectDashboard(body: VexorConnectDashboardBody): Promise<VexorConnectResponse> {
    return createConnectDashboard(this, body);
  }
  // ========================================================
  // vexor.connect and related methods                [END]
  // ========================================================

  /**
   * Refund method with platform-specific shortcuts.
   * @type {Object}
   * @property {Function} mercadopago - Shortcut for MercadoPago refunds.
   * @property {Function} stripe - Shortcut for Stripe refunds.
   * @property {Function} paypal - Shortcut for PayPal refunds.
   * 
   * @example
   * // Generic usage
   * vexor.refund({ platform: 'mercadopago', paymentId: 'payment_123' });
   * 
   * // Platform-specific shortcut
   * vexor.refund.mercadopago({ paymentId: 'payment_123' });
   * 
   * @description
   * Facilitates refund processing for various payment platforms.
   */
  refund: ReturnType<typeof vexorRefund>;

  createRefund(platform: SupportedVexorPlatform, body: VexorRefundBody): Promise<VexorRefundResponse> {
    return createRefund(this, platform, body);
  }

}

// Export the Vexor class as a named export instead of default
export { Vexor };

// Also export the types and interfaces
export type {
  SupportedVexorPlatform,
  VexorPaymentBody,
  VexorSubscriptionBody,
  VexorPaymentResponse,
  VexorParams,
  VexorPortalResponse,
  VexorPortalBody,
  VexorConnectBody,
  VexorConnectAuthBody,
  VexorConnectPayBody,
  VexorConnectDashboardBody,
  VexorConnectResponse,
  VexorRefundBody,
  VexorRefundResponse,
  VexorSubscriptionResponse
};
