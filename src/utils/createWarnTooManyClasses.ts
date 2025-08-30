const LIMIT = 200;

/**
 * This is a factory function that returns a function that will warn the
 * developer if a styled component is generating too many classes.
 *
 * This is a sign that the component is being created dynamically.
 */
export default function createWarnTooManyClasses(displayName: string, componentId: string) {
    const generatedClasses: { [key: string]: boolean } = {};
    let warningSeen = false;

    return (className: string) => {
        if (!warningSeen) {
            generatedClasses[className] = true;
            if (Object.keys(generatedClasses).length >= LIMIT) {
                // eslint-disable-next-line no-console
                console.warn(
                    `Over ${LIMIT} classes were generated for component ${displayName} with id ${componentId}. ` +
                    'This is a sign of creating a styled component inside a render function. ' +
                    'Move the component definition out of the render function to avoid this.'
                );
                warningSeen = true;
            }
        }
    };
}
