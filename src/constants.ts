export const IS_BROWSER = typeof window !== 'undefined' && 'document' in window;

// SC_ATTR is used to inject a data attribute onto the style tag,
// which is used for rehydration.
export const SC_ATTR = 'data-styled';

// SC_VERSION_ATTR is used to save the version of styled-components that is used
// to inject the styles. This is used to rehydrate the styles correctly.
export const SC_VERSION_ATTR = 'data-styled-version';

// DISABLE_SPEEDY is used to disable the speedy mode of styled-components.
// This is used for testing and debugging.
export const DISABLE_SPEEDY = !IS_BROWSER || document.head.getAttribute('data-styled-speedy') === 'false';

// SPLITTER is used to split the CSS rules into an array.
export const SPLITTER = '/*!*/';