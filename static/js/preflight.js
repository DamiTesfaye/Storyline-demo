import platform from "platform";
import isMobile from "ismobilejs";

const name = platform.name;
const version = parseFloat(platform.version, 10);

export const check = () => {
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
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch (e) {
    passed.webgl = false;
  }

  // Check Proxy is available
  passed.proxy = !!window.Proxy;

  // Check known bad browsers
  const mobile = isMobile(window.navigator).any;
  /*   alert(name); */
  if (
    (name.includes("Firefox") && mobile) ||
    (name.includes("Safari") && version <= 11) ||
    name.includes("IE")
  ) {
    passed.goodBrowser = false;
  } else {
    passed.goodBrowser = true;
  }
  return passed.webgl && passed.proxy && passed.goodBrowser;
};
