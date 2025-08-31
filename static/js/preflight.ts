import platform from "platform";
import isMobile from "ismobilejs";

const name: string | undefined = platform.name;
const version: number = parseFloat(platform.version as string, 10);

export const check = (): boolean => {
  const passed = {
    webgl: false,
    proxy: false,
    goodBrowser: false,
  };

  // Check WebGL
  try {
    const canvas = document.createElement("canvas");
    passed.webgl =
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    passed.webgl = false;
  }

  // Check Proxy is available
  passed.proxy = typeof (window as any).Proxy !== "undefined";

  // Check known bad browsers
  const mobile = isMobile(window.navigator).any;
  if (
    (name?.includes("Firefox") && mobile) ||
    (name?.includes("Safari") && version <= 11) ||
    name?.includes("IE")
  ) {
    passed.goodBrowser = false;
  } else {
    passed.goodBrowser = true;
  }
  return passed.webgl && passed.proxy && passed.goodBrowser;
};
