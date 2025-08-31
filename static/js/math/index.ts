export const TAU = Math.PI * 2;
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) * 0.5;

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const mean = (...vals: number[]): number => {
  const total = vals.reduce((value, current) => value + current);
  return total / vals.length;
};

export const clamp = (v: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, v));
};

export const distance = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): number => {
  const diff = {
    x: a.x - b.x,
    y: a.y - b.y,
  };
  const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  return isNaN(dist) ? 0 : dist;
};

export const ceilPOT = (v: number): number => {
  return Math.pow(2, Math.ceil(Math.log(v) / Math.log(2)));
};
