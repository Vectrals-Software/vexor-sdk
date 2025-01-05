export const SUPPORTED_PLATFORMS = {
    MERCADO_PAGO: {
        name: 'mercadopago',
        base_url: {
            production: 'https://api.mercadopago.com',
            sandbox: 'https://api.mercadopago.com'
        }
    },
    STRIPE: {
        name: 'stripe',
        base_url: {
            production: 'https://www.stripe.com',
            sandbox: 'https://sandbox.stripe.com'
        }
    },
    PAYPAL: {
        name: 'paypal',
        base_url: {
            production: 'https://api-m.paypal.com',
            sandbox: 'https://api-m.sandbox.paypal.com'
        }
    },
    TALO: {
        name: 'talo',
        base_url: {
            production: 'https://api.talo.com.ar',
            sandbox: 'https://sandbox-api.talo.com.ar'
        }
    },
    SQUARE: {
        name: 'square',
        base_url: {
            production: 'https://connect.squareup.com',
            sandbox: 'https://connect.squareupsandbox.com'
        }
    }
};