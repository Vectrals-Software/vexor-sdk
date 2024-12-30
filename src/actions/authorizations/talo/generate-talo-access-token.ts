interface GenerateTaloAccessTokenProps {
    user_id: string;
    client_id: string;
    client_secret: string;
    url: string;
}

export const generateTaloAccessToken = async ({ user_id, client_id, client_secret, url }: GenerateTaloAccessTokenProps) => {

    // Get talo token
    const tokenResult = await fetch(`${url}/users/${user_id}/tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id,
            client_secret
        })
    }).then(res => res.json());

    return tokenResult;
}