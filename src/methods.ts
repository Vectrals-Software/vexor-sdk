import { createCheckout, vexorPay } from "./methods/pay";
import { handleWebhook, vexorWebhook } from "./methods/webhook";
import { createSubscription, vexorSubscribe } from "./methods/subscribe";
import { createPortal, vexorPortal } from "./methods/portal";
import {
  createConnect,
  createConnectAuth,
  createConnectPay,
  createConnectDashboard,
  vexorConnect,
  createConnectAuthRefresh,
  createConnectRefund
} from "./methods/connect";
import { createRefund, vexorRefund } from "./methods/refund";
import { SupportedVexorPlatform } from "./types/platforms";
import {
  VexorPaymentBody,
  VexorSubscriptionBody,
  VexorPortalBody,
  VexorConnectBody,
  VexorConnectAuthBody,
  VexorConnectAuthRefreshBody,
  VexorConnectPayBody,
  VexorConnectDashboardBody,
  VexorConnectRefundRequest,
  VexorRefundBody
} from "./types/requests";

import {
  VexorPaymentResponse,
  VexorSubscriptionResponse,
  VexorPortalResponse,
  VexorConnectResponse,
  VexorConnectDashboardResponse,
  VexorRefundResponse
} from "./types/responses";

import { OpenSourceConfig, VexorConfig } from "./types/configuration";


// Main Vexor class for handling payments
class Vexor {
  // Singleton instance of Vexor
  private static instance: Vexor | null = null;

  // Using Vexor Cloud (commercial) version
  private publishableKey?: string;
  private secretKey?: string;
  private projectId?: string;
  private apiUrl: string = "https://www.vexorpay.com/api";

  // Using Vexor open source version
  public platforms?: OpenSourceConfig;

  // Add custom to the class properties
  custom: (url: string) => Vexor;

  // Constructor to initialize Vexor with parameters object
  constructor(params: VexorConfig) {

    // Vexor Cloud
    this.publishableKey = params.publishableKey;
    this.secretKey = params.secretKey;
    this.projectId = params.projectId;

    // Vexor open source configuration
    this.platforms = params.platforms || {};

    // Methods
    this.pay = vexorPay(this);
    this.webhook = vexorWebhook(this);
    this.subscribe = vexorSubscribe(this);
    this.portal = vexorPortal(this);
    this.connect = vexorConnect(this);
    this.refund = vexorRefund(this);

    // Test the API against a custom API URL
    this.custom = (url: string) => this.setApiUrl(url);
  }

  // Create a Vexor instance using environment variables. 
  // This way of creating an instance is used for Vexor Cloud only
  static fromEnv(): Vexor & { custom: (url: string) => Vexor } {
    if (!Vexor.instance) {

      const publishableKey = 
      /* Next.js */
      process.env.NEXT_PUBLIC_VEXOR_PUBLISHABLE_KEY 
      /* Node.js */
      || process.env.VEXOR_PUBLISHABLE_KEY;


      const secretKey = 
      /* Next.js */
      process.env.NEXT_PUBLIC_VEXOR_SECRET_KEY 
      /* Node.js */
      || process.env.VEXOR_SECRET_KEY;

      
      const projectId = 
      /* Next.js */
      process.env.NEXT_PUBLIC_VEXOR_PROJECT 
      /* Node.js */
      || process.env.VEXOR_PROJECT;

      if (!publishableKey) {
        throw new Error('Missing environment variable for publishable key');
      }
      if (!projectId) {
        throw new Error('Missing environment variable for project ID');
      }
      Vexor.instance = new Vexor({ publishableKey, projectId, secretKey });
    }

    const instance = Vexor.instance as Vexor & { custom: (url: string) => Vexor };
    instance.custom = function (url: string) {
      return this.setApiUrl(url);
    };

    return instance;
  }

  // Create a Vexor instance with provided parameters
  static init(params: VexorConfig): Vexor & { custom: (url: string) => Vexor } {

    // Use either Vexor Cloud or Vexor OpenSource
    if (params.platforms && (params.publishableKey || params.secretKey || params.projectId)) { 
      throw new Error('Vexor Cloud and Vexor OpenSource cannot be used together, please define only the platforms if you are using Vexor OpenSource or only the publishableKey, secretKey and projectId if you are using Vexor Cloud');
    }

    const instance = new Vexor(params) as Vexor & { custom: (url: string) => Vexor };
    instance.custom = function (url: string) {
      return this.setApiUrl(url);
    };
    return instance;
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
 * @property {Function} talo - Shortcut for Talo payments.
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
     * @property {Function} talo - Shortcut for Talo webhooks.
     * @property {Function} square - Shortcut for Square webhooks.
     * @example
     * // Generic usage
     * vexor.webhook(req);
     * 
     * // Platform-specific shortcut
     * vexor.webhook.mercadopago(req);
     * vexor.webhook.talo(req);
     * vexor.webhook.paypal(req);
     * vexor.webhook.stripe(req);
     * vexor.webhook.square(req);
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
   * @property {Function} refund - Shortcut for Stripe refund.
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

  createConnectAuthRefresh(body: VexorConnectAuthRefreshBody): Promise<VexorConnectResponse> {
    return createConnectAuthRefresh(this, body);
  }

  createConnectRefund(platform: SupportedVexorPlatform, body: VexorConnectRefundRequest): Promise<VexorConnectResponse> {
    return createConnectRefund(this, platform, body);
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

  private setApiUrl(url: string): Vexor {
    this.apiUrl = url;
    return this;
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
  VexorConfig,
  VexorPortalResponse,
  VexorPortalBody,
  VexorConnectBody,
  VexorConnectAuthBody,
  VexorConnectAuthRefreshBody,
  VexorConnectPayBody,
  VexorConnectDashboardBody,
  VexorConnectDashboardResponse,
  VexorConnectResponse,
  VexorRefundBody,
  VexorRefundResponse,
  VexorSubscriptionResponse,
  VexorConnectRefundRequest
};
