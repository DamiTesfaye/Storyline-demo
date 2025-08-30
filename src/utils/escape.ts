/**
 * Replaces characters in a string that are not valid in a CSS class name.
 */
export default function escape(str: string): string {
  return str.replace(/[^_a-zA-Z0-9-]/g, '-');
}