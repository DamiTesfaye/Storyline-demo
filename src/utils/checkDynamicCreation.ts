const componentIds: { [key: string]: string[] } = {};

/**
 * In development, we warn when a styled component is created dynamically.
 * This is an anti-pattern and can lead to performance issues.
 *
 * This function is a simple check that warns once per displayName.
 */
export function checkDynamicCreation(displayName: string, componentId: string) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    if (!componentIds[displayName]) {
        componentIds[displayName] = [componentId];
    } else if (componentIds[displayName].indexOf(componentId) === -1) {
        componentIds[displayName].push(componentId);

        // We only need to warn once per displayName
        // eslint-disable-next-line no-console
        console.warn(
            `It seems you are creating a styled component (${displayName}) inside a render function. ` +
            `This is an anti-pattern that will cause your styles to be re-injected on every render, leading to poor performance. ` +
            `To avoid this, move your component definition outside of the render function.`
        );
    }
}