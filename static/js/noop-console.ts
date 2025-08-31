const noopConsole = (): void => {
  const methods: (keyof Console)[] = [
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (console[method] as any) = () => {};
  });
};

export default noopConsole;
