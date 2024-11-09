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

declare const vexorConnect: (vexor: any) => ((params: {
    platform: SupportedVexorPlatform;
} & VexorConnectBody) => any) & {
    mercadopago: (body: VexorConnectBody) => any;
    stripe: (body: VexorConnectBody) => any;
    auth: (body: VexorConnectAuthBody) => any;
    pay: ((params: {
        platform: SupportedVexorPlatform;
    } & VexorConnectPayBody) => any) & {
        mercadopago: (body: VexorConnectPayBody) => any;
        stripe: (body: VexorConnectPayBody) => any;
    };
    dashboard: (body: VexorConnectDashboardBody) => any;
};

declare const vexorRefund: (vexor: any) => ((params: {
    platform: SupportedVexorPlatform;
} & VexorRefundBody) => any) & {
    mercadopago: (body: VexorRefundBody) => any;
    stripe: (body: VexorRefundBody) => any;
    paypal: (body: VexorRefundBody) => any;
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
interface VexorPaymentResponse {
    message: string;
    payment_url: string;
    identifier: string;
    raw: any;
}
interface VexorSubscriptionResponse {
    message: string;
    payment_url: string;
    identifier: string;
    raw: any;
}
interface VexorPortalResponse {
    message: string;
    portal_url: string;
    raw?: any;
}
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
interface VexorRefundBody {
    identifier: string;
}
interface VexorRefundResponse {
    message: string;
    refund_response: any;
    identifier: string;
    error?: any;
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
    createSubscription(platform: SupportedVexorPlatform, body: VexorSubscriptionBody): Promise<VexorSubscriptionResponse>;
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
    createConnect(platform: SupportedVexorPlatform, body: VexorConnectBody): Promise<VexorConnectResponse>;
    createConnectAuth(body: VexorConnectAuthBody): Promise<VexorConnectResponse>;
    createConnectPay(platform: SupportedVexorPlatform, body: VexorConnectPayBody): Promise<VexorConnectResponse>;
    createConnectDashboard(body: VexorConnectDashboardBody): Promise<VexorConnectResponse>;
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
    createRefund(platform: SupportedVexorPlatform, body: VexorRefundBody): Promise<VexorRefundResponse>;
}

export { type SupportedVexorPlatform, Vexor, type VexorConnectAuthBody, type VexorConnectBody, type VexorConnectDashboardBody, type VexorConnectPayBody, type VexorConnectResponse, type VexorParams, type VexorPaymentBody, type VexorPaymentResponse, type VexorPortalBody, type VexorPortalResponse, type VexorRefundBody, type VexorRefundResponse, type VexorSubscriptionBody, type VexorSubscriptionResponse };
