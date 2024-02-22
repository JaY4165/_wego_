export function purifyJson(jsonString: string) {
    const trimmedString = jsonString.trim().replace(/^['`"]+|['`"]+$/g, '');
    try {
        return JSON.parse(trimmedString);
    } catch (error) {
        throw new Error('Invalid JSON provided.');
    }
}