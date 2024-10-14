declare const vexorPay: (vexor: any) => ((params: {
    platform: SupportedVexorPlatform;
} & VexorPaymentBody) => any) & {
    mercadopago: (body: VexorPaymentBody) => any;
    stripe: (body: VexorPaymentBody) => any;
    paypal: (body: VexorPaymentBody) => any;
};

declare const vexorWebhook: (vexor: any) => ((req: Request) => any) & {
    mercadopago: (req: Request) => any;
    stripe: (req: Request) => any;
    paypal: (req: Request) => any;
};

declare const vexorSubscribe: (vexor: any) => ((params: {
    platform: SupportedVexorPlatform;
} & VexorSubscriptionBody) => any) & {
    mercadopago: (body: VexorSubscriptionBody) => any;
    stripe: (body: VexorSubscriptionBody) => any;
    paypal: (body: VexorSubscriptionBody) => any;
};

declare const vexorPortal: (vexor: any) => ((params: {
    platform: SupportedVexorPlatform;
} & VexorPortalBody) => any) & {
    mercadopago: (body: VexorPortalBody) => any;
    stripe: (body: VexorPortalBody) => any;
    paypal: (body: VexorPortalBody) => any;
};

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
    pay: ReturnType<typeof vexorPay>;
    createCheckout(platform: SupportedVexorPlatform, body: VexorPaymentBody): Promise<VexorPaymentResponse>;
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
    handleWebhook(req: Request): Promise<any>;
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
    createSubscription(platform: SupportedVexorPlatform, body: VexorSubscriptionBody): Promise<VexorPaymentResponse>;
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
    createPortal(platform: SupportedVexorPlatform, body: VexorPortalBody): Promise<VexorPortalResponse>;
}

export { type SupportedVexorPlatform, Vexor, type VexorParams, type VexorPaymentBody, type VexorPaymentResponse, type VexorPortalBody, type VexorPortalResponse, type VexorSubscriptionBody };
