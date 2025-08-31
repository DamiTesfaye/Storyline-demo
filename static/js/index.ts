import platform from "platform";
import preflightFailMessage from "./preflight-fail.partial.html?raw";
import "./index.css";
import "./style.css";

const start = async (): Promise<void> => {
  let module: any;

  module = await import("./preflight");
  const ok = module.check();

  if (ok) {
    module = await import("./main");
    module.main();
  } else {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = preflightFailMessage.replace(
        "%platform%",
        `${platform.name} version ${platform.version}`
      );
    }
  }
};

start();
