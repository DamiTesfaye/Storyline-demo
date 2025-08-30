/**
 * A simple hash function for strings, based on djb2.
 *
 * @param str The string to hash.
 */
export function hash(str: string): number {
    let h = 5381;
    let i = str.length;

    while (i) {
        h = (h * 33) ^ str.charCodeAt(--i);
    }

    return h;
}

/**
 * A progressive hash function for strings and numbers, based on djb2.
 *
 * @param h The seed.
 * @param x The value to hash.
 */
export function phash(h: number, x: string | number | undefined | null): number {
    if (x == null) return h;

    const str = String(x);
    let i = str.length;

    while (i) {
        h = (h * 33) ^ str.charCodeAt(--i);
    }

    return h;
}
