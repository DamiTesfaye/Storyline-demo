import { createContext, useContext } from 'react';
import StyleSheet from '../sheet/Sheet';
import { Sheet, Stringifier } from '../types';

// This is a mock implementation. A real Stylis instance would be the CSS preprocessor.
const mockStylis: Stringifier = (css: string) => css;

// Create a default StyleSheet instance that will be used by default.
const mainSheet = new StyleSheet();

const StyleSheetContext = createContext<Sheet>(mainSheet);
const StylisContext = createContext<Stringifier>(mockStylis);

StyleSheetContext.displayName = 'StyleSheetContext';
StylisContext.displayName = 'StylisContext';

/**
 * A hook to get the current StyleSheet instance from the context.
 */
export function useStyleSheet(): Sheet {
  return useContext(StyleSheetContext);
}

/**
 * A hook to get the current Stylis instance from the context.
 */
export function useStylis(): Stringifier {
  return useContext(StylisContext);
}