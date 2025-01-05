import { generateTaloAccessToken } from "@/actions/authorizations/talo/generate-talo-access-token";
import { SUPPORTED_PLATFORMS } from "@/lib/constants";
import { Vexor } from "@/methods";

export const retrieveTaloOperation = async (vexor: Vexor, operationId: string) => {

    // Get the platform credentials
    const platformCredentials = vexor.platforms?.talo

    if (!platformCredentials) {
        throw new Error('Talo credentials not found');
    }

    // Check if it's a sandbox or production environment
    const isSandbox = platformCredentials?.sandbox === true;
    const mode = isSandbox ? 'sandbox' : 'production';
    const API_URL = isSandbox ? SUPPORTED_PLATFORMS.TALO.base_url.sandbox : SUPPORTED_PLATFORMS.TALO.base_url.production;


    const tokenResult = await generateTaloAccessToken({
        user_id: platformCredentials.user_id,
        client_id: platformCredentials.client_id,
        client_secret: platformCredentials.client_secret,
        url: API_URL
    });

    if (!tokenResult.data?.token) {
       throw new Error('Talo token not found');
    }

    const taloToken = tokenResult.data.token;

    // Get talo payment
    const result = await fetch(`${API_URL}/payments/${operationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${taloToken}`
        },
    }).then(res => res.json());

    return result;
}