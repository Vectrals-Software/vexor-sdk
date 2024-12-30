export const generatePaypalAccessToken = async (clientId: string, clientSecret: string, base: string) => {

    try {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
        throw error;
    }
};