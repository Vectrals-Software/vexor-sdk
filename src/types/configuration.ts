// Vexor configuration

export interface OpenSourceConfig {
    mercadopago?: {
      public_key: string;
      access_token: string;
      client_id?: string;
      client_secret?: string;
      webhook_secret?: string;
      webhooks_url?: string;
      sandbox?: boolean;
    },
    stripe?: {
      public_key: string;
      secret_key: string;
      webhook_secrets?: string[];
      sandbox?: boolean;
    },
    paypal?: {
      client_id: string;
      secret_key: string;
      webhook_id?: string;
      sandbox?: boolean;
    },
    talo?: {
      user_id: string;
      client_id: string;
      client_secret: string;
      webhooks_url?: string;
      sandbox?: boolean;
    },
    square?: {
      access_token: string;
      application_id: string;
      webhooks_url?: string;
      sandbox?: boolean;
    }
}

// Define the structure for Vexor constructor parameters
export interface VexorConfig {
  publishableKey?: string;
  projectId?: string;
  secretKey?: string;
  platforms?: OpenSourceConfig;
}
