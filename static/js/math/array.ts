const interpolate = (arr: number[], num: number): number[] => {
  const linearInterpolate = (
    before: number,
    after: number,
    atPoint: number
  ): number => {
    return before + (after - before) * atPoint;
  };
  const newData: number[] = [];
  const springFactor = (arr.length - 1) / (num - 1);
  newData[0] = arr[0];
  for (let i = 1; i < num - 1; i++) {
    const tmp = i * springFactor;
    const before = Math.floor(tmp);
    const after = Math.ceil(tmp);
    const atPoint = tmp - before;
    newData[i] = linearInterpolate(arr[before], arr[after], atPoint);
  }
  newData[num - 1] = arr[arr.length - 1];
  return newData;
};

export { interpolate };
