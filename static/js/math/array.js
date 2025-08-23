const interpolate = (arr, num) => {
  const linearInterpolate = (before, after, atPoint) => {
    return before + (after - before) * atPoint;
  };
  const newData = new Array();
  const springFactor = new Number((arr.length - 1) / (num - 1));
  newData[0] = arr[0]; // for new allocation
  for (let i = 1; i < num - 1; i++) {
    const tmp = i * springFactor;
    const before = new Number(Math.floor(tmp)).toFixed();
    const after = new Number(Math.ceil(tmp)).toFixed();
    const atPoint = tmp - before;
    newData[i] = linearInterpolate(arr[before], arr[after], atPoint);
    /* console.log(arr[before], arr[after]); */
  }
  newData[num - 1] = arr[arr.length - 1]; // for new allocation
  return newData;
};

export { interpolate };
