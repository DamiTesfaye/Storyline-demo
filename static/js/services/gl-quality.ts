import issues from "./issues";

export const LOW = 0;
export const MEDIUM = 1;
export const HIGH = 2;

export const get = (): number => {
  const anyIssues = issues as any;
  if (anyIssues.IS_DX_INTEL_GPU) return LOW;
  if (anyIssues.IS_INTEL_GPU) return MEDIUM;
  return HIGH;
};

export default { get, LOW, MEDIUM, HIGH };
