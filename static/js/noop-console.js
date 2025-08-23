const noopConsole = () => {
  const methods = [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "exception",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "markTimeline",
    "profile",
    "profileEnd",
    "table",
    "time",
    "timeEnd",
    "timeStamp",
    "trace",
    "warn",
    "log",
  ];
  methods.forEach((method) => {
    console[method] = () => {};
  });
};

export default noopConsole;
