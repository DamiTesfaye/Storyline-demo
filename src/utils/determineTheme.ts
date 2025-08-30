import { EMPTY_OBJECT } from './empties';

/**
 * Determine the theme object that should be passed to the component.
 * It will be resolved from the theme prop, the theme context, and the
 * component's default props.
 */
export default function determineTheme(
  props: any,
  themeContext?: any,
  defaultProps?: any
): object {
  const propsTheme = props.theme && props.theme !== themeContext ? props.theme : EMPTY_OBJECT;
  const contextTheme = themeContext || EMPTY_OBJECT;
  const defaultTheme = defaultProps ? defaultProps.theme : EMPTY_OBJECT;

  // props theme, then context theme, then default theme
  return { ...defaultTheme, ...contextTheme, ...propsTheme };
}