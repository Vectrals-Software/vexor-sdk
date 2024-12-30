// Define the structure for payment response
export interface VexorPaymentResponse {
    message: string;
    payment_url: string;
    identifier: string;
    raw: any;
}

// Define the structure for subscription response
export interface VexorSubscriptionResponse {
    message: string;
    payment_url: string;
    identifier: string;
    raw: any;
}

// Define the structure for portal response
export interface VexorPortalResponse {
    message: string;
    portal_url: string;
    raw?: any;
}


export interface VexorConnectDashboardResponse {
    message: string;
    dashboard_url: string;
    identifier: string;
    raw: any;
  }
  
export interface VexorConnectResponse {
    message: string;
    connect_url?: string;
    payment_url?: string;
    dashboard_url?: string;
    identifier: string;
    raw: any;
  }




export interface VexorRefundResponse {
    message: string;
    raw: any;
    identifier: string;
    error?: any;
  }