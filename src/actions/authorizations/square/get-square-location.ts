// Get Square location id

interface GetSquareLocationProps {
    url: string;
    accessToken: string;
}

export const getSquareLocation = async ({url, accessToken}: GetSquareLocationProps) => {
    try {
        const locationsResponse = await fetch(`${url}/v2/locations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!locationsResponse?.ok) {
            throw new Error(`HTTP error! status: ${locationsResponse.status} \nMake sure the request is made from the server not from the client side`);
        }

        return await locationsResponse.json();
    } catch (error) {
        console.error('Error fetching Square location:', error);
        throw error;
    }
}