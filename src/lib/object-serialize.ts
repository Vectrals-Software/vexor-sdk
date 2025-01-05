// Helper function to safely serialize any object
export const serializeToPlainObject = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        // Handle special cases like BigInt, Date, etc.
        if (typeof value === 'bigint') {
            return value.toString();
        }
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }));
};