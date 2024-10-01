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
interface VexorPaymentResponse {
    message: string;
    result: {
        payment_url: string;
        identifier: string;
        raw: any;
    };
}
declare class Vexor {
    private static instance;
    private apiKey;
    private apiSecret?;
    private projectId;
    private apiUrl;
    constructor(apiKey: string, projectId: string, apiSecret?: string);
    static fromEnv(): Vexor;
    static init(apiKey: string, projectId: string, apiSecret: string): Vexor;
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
}

export { type SupportedVexorPlatform, Vexor, type VexorPaymentBody, type VexorPaymentResponse };
