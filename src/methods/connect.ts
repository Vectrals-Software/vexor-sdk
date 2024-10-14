import { SupportedVexorPlatform, VexorConnectBody, VexorConnectResponse, VexorConnectAuthBody, VexorConnectPayBody, VexorConnectDashboardBody } from "../methods";

export const vexorConnect = (vexor: any) => {
  return Object.assign(
    // Generic connect method
    (params: { platform: SupportedVexorPlatform } & VexorConnectBody) =>
      vexor.createConnect(params.platform, params),
    // Platform-specific connect methods
    {
      mercadopago: (body: VexorConnectBody) => vexor.createConnect('mercadopago', body),
      stripe: (body: VexorConnectBody) => vexor.createConnect('stripe', body),
      auth: (body: VexorConnectAuthBody) => vexor.createConnectAuth(body),
      pay: Object.assign(
        (params: { platform: SupportedVexorPlatform } & VexorConnectPayBody) =>
          vexor.createConnectPay(params.platform, params),
        {
          mercadopago: (body: VexorConnectPayBody) => vexor.createConnectPay('mercadopago', body),
          stripe: (body: VexorConnectPayBody) => vexor.createConnectPay('stripe', body),
        }
      ),
      dashboard: (body: VexorConnectDashboardBody) => vexor.createConnectDashboard(body),
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

