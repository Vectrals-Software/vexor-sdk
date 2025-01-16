export const formatInterval = (interval: string, platform: string) => {
    if (platform === 'mercadopago') {
        switch (interval) {
            case 'month':
                return 'months';
            case 'day':
                return 'days';
            default:
                return interval;
        }
    }

    if (platform === 'paypal') {
        switch (interval) {
            case 'day':
                return 'DAY';
            case 'week':
                return 'WEEK';
            case 'month':
                return 'MONTH';
            case 'year':
                return 'YEAR';
            default:
                return interval;
        }
    }

    return interval;
}