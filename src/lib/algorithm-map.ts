export function mapAuthAlgo(algo: string): string {
    switch (algo.toUpperCase()) {
        case 'SHA256WITHRSA':
            return 'RSA-SHA256';
        case 'SHA1WITHRSA':
            return 'RSA-SHA1';
        default:
            throw new Error(`Unsupported authentication algorithm: ${algo}`);
    }
}