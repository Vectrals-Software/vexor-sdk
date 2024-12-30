 // Get Square location id

 interface GetSquareLocationProps {
    url: string;
    accessToken: string;
 }

export const getSquareLocation = async ({url, accessToken}: GetSquareLocationProps) => {

    // NOT WORKING FROM CLIENT SIDE: THIS REQUEST NEEDS TO BE MADE FROM THE SERVER SIDE,
    // BECAUSE OF SQUARES' CORS POLICY
    const locationsResponse = await fetch(`${url}/v2/locations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

    }).then(res => res.json());

    return locationsResponse;
 }