/**
 * A simple hash function that takes a string and returns a base-36 encoded string.
 * This is used to generate unique component IDs for styled-components.
 *
 * @param {string} str The string to hash.
 */
export default function generateComponentId(str: string): string {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  return (hash >>> 0).toString(36);
}