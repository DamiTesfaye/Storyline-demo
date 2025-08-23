import { clamp } from "./index";

export const linear = (v) => v;
// accelerating from zero velocity
export const easeInQuad = (t) => t * t;
// decelerating to zero velocity
export const easeOutQuad = (t) => t * (2 - t);
// acceleration until halfway, then deceleration
export const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// accelerating from zero velocity
export const easeInCubic = (t) => t * t * t;
// decelerating to zero velocity
export const easeOutCubic = (t) => --t * t * t + 1;
// acceleration until halfway, then deceleration
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// accelerating from zero velocity
export const easeInQuart = (t) => t * t * t * t;
// decelerating to zero velocity
export const easeOutQuart = (t) => 1 - --t * t * t * t;
// acceleration until halfway, then deceleration
export const easeInOutQuart = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
// accelerating from zero velocity
export const easeInQuint = (t) => t * t * t * t * t;
// decelerating to zero velocity
export const easeOutQuint = (t) => 1 + --t * t * t * t * t;
// acceleration until halfway, then deceleration
export const easeInOutQuint = (t) =>
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
  source,
  sourceA,
  sourceB,
  targetA,
  targetB,
  f = linear,
  doClamp = false
) => {
  f = typeof f === "string" || f instanceof String ? lookup(f) : f;

  let value =
    targetA + f((targetB - targetA) / (sourceB - sourceA)) * (source - sourceA);

  if (doClamp) {
    const min = Math.min(targetA, targetB);
    const max = Math.max(targetA, targetB);
    value = clamp(value, min, max);
  }
  return value;
};

export const create = (
  sourceA,
  sourceB,
  targetA,
  targetB,
  f = linear,
  doClamp = false
) => {
  return (source) =>
    map(source, sourceA, sourceB, targetA, targetB, f, doClamp);
};
