import { RefCallback } from 'react';

type ReactRef<T> = RefCallback<T> | { current: T | null } | null;

export default function mergeRefs<T>(refs: ReactRef<T>[]) {
  return (value: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        ref.current = value;
      }
    });
  };
}