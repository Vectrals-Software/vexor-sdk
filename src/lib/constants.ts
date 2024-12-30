export const SUPPORTED_PLATFORMS = {
    MERCADO_PAGO: {
        name: 'mercadopago',
        base_url: {
            production: 'https://www.mercadopago.com.br',
            sandbox: 'https://sandbox.mercadopago.com.br'
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
            production: 'https://www.paypal.com',
            sandbox: 'https://sandbox.paypal.com'
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