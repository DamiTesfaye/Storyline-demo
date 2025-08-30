import { Target } from '../types';

export default function getComponentName(target: Target): string {
  // The target can be a React component which may have a `displayName` or `name` property.
  // This provides a good fallback for debugging purposes.
  return (target as any).displayName || (target as any).name || 'Component';
}