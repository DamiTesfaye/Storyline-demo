const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a base-52 encoded string from a number.
 *
 * @param code The number to encode.
 */
export default function generateAlphabeticName(code: number): string {
    let name = '';
    let x = code;

    while (x > 0) {
        name = chars[x % 52] + name;
        x = Math.floor(x / 52);
    }

    return name;
}