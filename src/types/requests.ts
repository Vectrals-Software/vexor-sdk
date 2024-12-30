// Define the supported payment methods
export type SupportedVexorPaymentMethods = Array<'transfer' | 'crypto'>;

// Define the structure for payment request body
export interface VexorPaymentBody {
  items: Array<{
    id?: string;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
  }>;
  options?: {
    successRedirect?: string;
    pendingRedirect?: string;
    failureRedirect?: string;
    paymentMethods?: SupportedVexorPaymentMethods; // Currently only for Talo 
    currency?: string;
  };
}

export interface VexorPortalBody {
  identifier: string;
  returnUrl: string;
}

export interface VexorSubscriptionBody {
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

export interface VexorConnectBody {
  redirectUrl: string;
  countryCode?: string;
  express?: boolean;
}

export interface VexorConnectAuthBody {
  url: string;
}

export interface VexorConnectAuthRefreshBody {
  identifier: string;
}

export interface VexorConnectPayBody {
  redirectUrl: string;
  seller: {
    identifier: string;
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

export interface VexorConnectDashboardBody {
  account_identifier: string;
}

export interface VexorConnectRefundRequest {
  identifier: string;
  seller: {
    identifier: string;
  }
}

export interface VexorRefundBody {
  identifier: string;
}