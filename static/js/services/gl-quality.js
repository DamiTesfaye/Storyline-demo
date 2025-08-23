import issues from "./issues";

const LOW = 0;
const MEDIUM = 1;
const HIGH = 2;

const get = () => {
  if (issues.IS_DX_INTEL_GPU) return LOW;
  if (issues.IS_INTEL_GPU) return MEDIUM;
  return HIGH;
};

export default { get, LOW, MEDIUM, HIGH };
