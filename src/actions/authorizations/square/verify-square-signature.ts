import crypto from 'crypto';

interface SignatureVerificationProps {
    request: string;
    webhooks_url: string;
    webhook_signature_key: string;
    signature: string;
}

export const verifySquareSignature = ({
    request,
    webhooks_url,
    webhook_signature_key,
    signature
}: SignatureVerificationProps) => {

    try {
        // Perform UTF-8 encoding to bytes
        let payloadBytes = Buffer.from(webhooks_url + request, 'utf-8');
        let signatureKeyBytes = Buffer.from(webhook_signature_key, 'utf-8');

        // Compute the hash value
        const hmac = crypto.createHmac('sha256', signatureKeyBytes);
        hmac.update(payloadBytes);

        // Compare the computed hash vs the value in the signature header
        const hashBase64 = hmac.digest('base64');
        const isValid = hashBase64 === signature;

        if (!isValid) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying Square signature:', error);
        return false;
    }
}