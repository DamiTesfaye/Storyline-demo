import { StyledComponentWrapper, Target } from '../types';

/**
 * Checks if a given target is a styled-component.
 */
export default function isStyledComponent(target: Target): target is StyledComponentWrapper<any, any> {
    // A styled-component will have a `styledComponentId` property.
    return !!(target && (target as any).styledComponentId);
}