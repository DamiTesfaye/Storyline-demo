import platform from "platform";
import preflightFailMessage from "./preflight-fail.partial.html?raw";
import "./index.css";
import "./style.css";

const start = async () => {
  let module;

  module = await import("./preflight");
  const ok = module.check();

  if (ok) {
    module = await import("./main");
    module.main();
  } else {
    const root = document.getElementById("root");
    root.innerHTML = preflightFailMessage.replace(
      "%platform%",
      `${platform.name} version ${platform.version}`
    );
  }
};
start();
