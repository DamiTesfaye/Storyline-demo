import type { MutableRefObject, Ref } from 'react';

export default function mergeRefs<T>(refs: Array<Ref<T>>): (value: T) => void {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null && ref !== undefined) {
        (ref as MutableRefObject<T>).current = value;
      }
    });
  };
}
