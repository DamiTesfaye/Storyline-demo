import { Target } from '../types';

/**
 * Checks if a given target is an HTML tag name.
 */
export default function isTag(target: Target): target is string {
  return typeof target === 'string';
}