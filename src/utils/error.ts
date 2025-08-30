const ERRORS: { [code: number]: string } = {
    16:
        'Group index out of bounds, the group index you are trying to access is bigger than the maximum number of groups allowed. (%s)',
};

/**
 * A helper function to throw an error with a link to the documentation. In production, this will
 * only throw a generic error. In development, it will also include a detailed message.
 */
export default function throwStyledError(code: number, ...interpolations: string[]): never {
    let message = `An error occurred.`;

    if (process.env.NODE_ENV !== 'production') {
        const devMessage = ERRORS[code]?.replace(/%s/g, () => interpolations.shift() || '');
        if (devMessage) message += `\n\n${devMessage}`;
    }

    throw new Error(message);
}