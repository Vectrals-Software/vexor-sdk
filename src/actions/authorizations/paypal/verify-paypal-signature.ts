import { mapAuthAlgo } from "@/lib/algorithm-map";
import { downloadAndCacheCertificate } from "./certification";
import crypto from 'crypto';

export async function verifyPaypalSignature(message: string, transmissionSig: string, certUrl: string, authAlgo: string): Promise<boolean> {
    try {
        // Download and cache the certificate
        const cert = await downloadAndCacheCertificate(certUrl);

        // Map PayPal's auth algo to Node.js crypto algo
        const cryptoAlgo = mapAuthAlgo(authAlgo);

        // Create a verification object
        const verifier = crypto.createVerify(cryptoAlgo);

        // Add the original message to the verifier
        verifier.update(message);

        // Create buffer from base64-encoded signature
        const signatureBuffer = Buffer.from(transmissionSig, 'base64');

        // Verify the signature
        return verifier.verify(cert, signatureBuffer);
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}