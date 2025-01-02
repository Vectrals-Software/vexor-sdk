import crypto from "crypto";

interface SignatureVerificationProps {
    x_signature: string;
    mercadopagoWebhookSecret: string;
    data_id: string;
    x_request_id: string;
}

export const isValidMercadoPagoSignature = ({
    x_signature,
    mercadopagoWebhookSecret,
    data_id,
    x_request_id
}: SignatureVerificationProps) => {
    const ts = x_signature?.split(",")?.[0]?.split("=")?.[1];
    const hash = x_signature?.split(",")?.[1]?.split("=")?.[1];

    const manifest = `id:${data_id};request-id:${x_request_id};ts:${ts};`
    let isValidSignature = false;

    const cyphed_signature = crypto
        .createHmac("sha256", mercadopagoWebhookSecret)
        .update(manifest)
        .digest("hex");

    if (cyphed_signature === hash) {
        isValidSignature = true;
    }

    return isValidSignature;
}