type SupportedVexorPlatform = 'mercadopago' | 'stripe' | 'paypal';
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
interface VexorPaymentResponse {
    message: string;
    result: {
        payment_url: string;
        identifier: string;
        raw: any;
    };
}
interface VexorPortalResponse {
    message: string;
    result: {
        portal_url: string;
        raw?: any;
    };
}
interface VexorParams {
    publishableKey: string;
    projectId: string;
    secretKey?: string;
}
declare class Vexor {
    private static instance;
    private publishableKey;
    private secretKey?;
    private projectId;
    private apiUrl;
    constructor(params: VexorParams);
    static fromEnv(): Vexor;
    static init(params: VexorParams): Vexor;
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
    pay: ((params: {
        platform: SupportedVexorPlatform;
    } & VexorPaymentBody) => Promise<VexorPaymentResponse>) & {
        mercadopago: (body: VexorPaymentBody) => Promise<VexorPaymentResponse>;
        stripe: (body: VexorPaymentBody) => Promise<VexorPaymentResponse>;
        paypal: (body: VexorPaymentBody) => Promise<VexorPaymentResponse>;
    };
    private createCheckout;
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
    webhook: ((req: Request) => Promise<any>) & {
        mercadopago: (req: Request) => Promise<any>;
        stripe: (req: Request) => Promise<any>;
        paypal: (req: Request) => Promise<any>;
    };
    private handleWebhook;
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
    subscribe: ((params: {
        platform: SupportedVexorPlatform;
    } & VexorSubscriptionBody) => Promise<VexorPaymentResponse>) & {
        mercadopago: (body: VexorSubscriptionBody) => Promise<VexorPaymentResponse>;
        stripe: (body: VexorSubscriptionBody) => Promise<VexorPaymentResponse>;
        paypal: (body: VexorSubscriptionBody) => Promise<VexorPaymentResponse>;
    };
    private createSubscription;
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
    portal: ((params: {
        platform: SupportedVexorPlatform;
    } & VexorPortalBody) => Promise<VexorPortalResponse>) & {
        mercadopago: (body: VexorPortalBody) => Promise<VexorPortalResponse>;
        stripe: (body: VexorPortalBody) => Promise<VexorPortalResponse>;
        paypal: (body: VexorPortalBody) => Promise<VexorPortalResponse>;
    };
    private createPortal;
}

export { type SupportedVexorPlatform, Vexor, type VexorParams, type VexorPaymentBody, type VexorPaymentResponse, type VexorPortalBody, type VexorPortalResponse };
