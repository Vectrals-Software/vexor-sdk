import { SupportedVexorPlatform, VexorConnectBody, VexorConnectResponse, VexorConnectAuthBody, VexorConnectPayBody, VexorConnectDashboardBody, VexorConnectAuthRefreshBody, VexorConnectRefundRequest } from "../methods";

export const vexorConnect = (vexor: any) => {
  return Object.assign(
    // Generic connect method
    (params: { platform: SupportedVexorPlatform } & VexorConnectBody) =>
      vexor.createConnect(params.platform, params),
    // Platform-specific connect methods
    {
      mercadopago: (body: VexorConnectBody) => vexor.createConnect('mercadopago', body),
      stripe: (body: VexorConnectBody) => vexor.createConnect('stripe', body),
      auth: Object.assign(
        (body: VexorConnectAuthBody) => vexor.createConnectAuth(body),
        {
          refresh: (body: VexorConnectAuthRefreshBody) => vexor.createConnectAuthRefresh(body),
        }
      ),
      pay: Object.assign(
        (params: { platform: SupportedVexorPlatform } & VexorConnectPayBody) =>
          vexor.createConnectPay(params.platform, params),
        {
          mercadopago: (body: VexorConnectPayBody) => vexor.createConnectPay('mercadopago', body),
          stripe: (body: VexorConnectPayBody) => vexor.createConnectPay('stripe', body),
        }
      ),
      dashboard: (body: VexorConnectDashboardBody) => vexor.createConnectDashboard(body),
      refund: Object.assign(
        // Generic refund method
        (params: { platform: SupportedVexorPlatform } & VexorConnectRefundRequest) =>
            vexor.createConnectRefund(params.platform, params),
        // Platform-specific refund methods
        {
            mercadopago: (body: VexorConnectRefundRequest) => vexor.createConnectRefund('mercadopago', body),
            stripe: (body: VexorConnectRefundRequest) => vexor.createConnectRefund('stripe', body),
            /* paypal: (body: VexorConnectRefundRequest) => vexor.createConnectRefund('paypal', body), */
        }
      ),
    }
  );
}

export async function createConnect(vexor: any, platform: SupportedVexorPlatform, body: VexorConnectBody): Promise<VexorConnectResponse> {
  const response = await fetch(`${vexor.apiUrl}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vexor-key': vexor.secretKey,
      'x-vexor-platform': platform,
      'x-vexor-project-id': vexor.projectId,
      'x-vexor-action': 'connect',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || 'An unknown error occurred';
    throw new Error(`Connect request failed: ${errorMessage}`);
  }

  return data;
}

export async function createConnectAuth(vexor: any, body: VexorConnectAuthBody): Promise<VexorConnectResponse> {
  const response = await fetch(`${vexor.apiUrl}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vexor-key': vexor.secretKey,
      'x-vexor-platform': 'mercadopago',
      'x-vexor-project-id': vexor.projectId,
      'x-vexor-action': 'get_credentials',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || 'An unknown error occurred';
    throw new Error(`Connect auth request failed: ${errorMessage}`);
  }

  return data;
}

export async function createConnectPay(vexor: any, platform: SupportedVexorPlatform, body: VexorConnectPayBody): Promise<VexorConnectResponse> {
  const response = await fetch(`${vexor.apiUrl}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vexor-key': vexor.secretKey,
      'x-vexor-platform': platform,
      'x-vexor-project-id': vexor.projectId,
      'x-vexor-action': 'create_payment',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || 'An unknown error occurred';
    throw new Error(`Connect pay request failed: ${errorMessage}`);
  }

  return data;
}

export async function createConnectDashboard(vexor: any, body: VexorConnectDashboardBody): Promise<VexorConnectResponse> {
  const response = await fetch(`${vexor.apiUrl}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vexor-key': vexor.secretKey,
      'x-vexor-platform': 'stripe',
      'x-vexor-project-id': vexor.projectId,
      'x-vexor-action': 'get_dashboard_link',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || 'An unknown error occurred';
    throw new Error(`Connect dashboard request failed: ${errorMessage}`);
  }

  return data;
}

export async function createConnectRefund(vexor: any, platform: SupportedVexorPlatform, body: VexorConnectRefundRequest): Promise<VexorConnectResponse> {
  const response = await fetch(`${vexor.apiUrl}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vexor-key': vexor.secretKey,
      'x-vexor-platform': platform,
      'x-vexor-project-id': vexor.projectId,
      'x-vexor-action': 'create_refund',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || 'An unknown error occurred';
    throw new Error(`Connect refund request failed: ${errorMessage}`);
  }

  return data;
}

export async function createConnectAuthRefresh(vexor: any, body: VexorConnectAuthRefreshBody): Promise<VexorConnectResponse> {
  const response = await fetch(`${vexor.apiUrl}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vexor-key': vexor.secretKey,
      'x-vexor-platform': 'mercadopago',
      'x-vexor-project-id': vexor.projectId,
      'x-vexor-action': 'refresh_credentials',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || 'An unknown error occurred';
    throw new Error(`Connect auth refresh request failed: ${errorMessage}`);
  }

  return data;
}

