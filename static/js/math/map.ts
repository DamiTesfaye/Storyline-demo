import { clamp } from "./index";

export const linear = (v: number): number => v;
// accelerating from zero velocity
export const easeInQuad = (t: number): number => t * t;
// decelerating to zero velocity
export const easeOutQuad = (t: number): number => t * (2 - t);
// acceleration until halfway, then deceleration
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// accelerating from zero velocity
export const easeInCubic = (t: number): number => t * t * t;
// decelerating to zero velocity
export const easeOutCubic = (t: number): number => --t * t * t + 1;
// acceleration until halfway, then deceleration
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// accelerating from zero velocity
export const easeInQuart = (t: number): number => t * t * t * t;
// decelerating to zero velocity
export const easeOutQuart = (t: number): number => 1 - --t * t * t * t;
// acceleration until halfway, then deceleration
export const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
// accelerating from zero velocity
export const easeInQuint = (t: number): number => t * t * t * t * t;
// decelerating to zero velocity
export const easeOutQuint = (t: number): number => 1 + --t * t * t * t * t;
// acceleration until halfway, then deceleration
export const easeInOutQuint = (t: number): number =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;

const lookup = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeInOutQuint,
};

export const map = (
  source: number,
  sourceA: number,
  sourceB: number,
  targetA: number,
  targetB: number,
  f: ((v: number) => number) | string = linear,
  doClamp = false
): number => {
  const fn: (v: number) => number =
    typeof f === "string" || f instanceof String ? lookup[f as string] : f;

  let value =
    targetA + fn((targetB - targetA) / (sourceB - sourceA)) * (source - sourceA);

  if (doClamp) {
    const min = Math.min(targetA, targetB);
    const max = Math.max(targetA, targetB);
    value = clamp(value, min, max);
  }
  return value;
};

export const create = (
  sourceA: number,
  sourceB: number,
  targetA: number,
  targetB: number,
  f: ((v: number) => number) | string = linear,
  doClamp = false
) => {
  return (source: number) =>
    map(source, sourceA, sourceB, targetA, targetB, f, doClamp);
};
