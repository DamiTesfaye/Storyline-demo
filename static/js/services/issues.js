import platform from "platform";
import isMobile from "ismobilejs";
import canAutoPlay from "can-autoplay";

const name = platform.name;
const version = parseFloat(platform.version, 10);

const issues = {};

issues.PLATFORM = platform;
issues.MOBILE = isMobile(window.navigator).any;

// https://github.com/mrdoob/three.js/issues/9716
issues.THREE_9716 =
  name === "Safari" /* && version < 11.1 */ ||
  (name === "Firefox" && version < 57);

issues.USE_CONCURRENT = name === "Chrome";

issues.WEBGL_MAX_TEXTURE_UNITS = 0;
issues.WEBGL_AVAILABLE = (() => {
  try {
    const canvas = document.createElement("canvas");
    if (!window.WebGLRenderingContext) return false;
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // whilst we're here, how many texture units are available
    issues.WEBGL_MAX_TEXTURE_UNITS = gl.getParameter(
      gl.MAX_TEXTURE_IMAGE_UNITS
    );
    return !!gl;
  } catch (e) {
    console.warn(e);
    return false;
  }
})();

// WebGL tests
// TODO: account for the context not being available
const ctx = document.createElement("canvas").getContext("webgl");

issues.GPU_VENDOR = (() => {
  try {
    const debug = ctx.getExtension("WEBGL_debug_renderer_info");
    if (debug) {
      const vendor = ctx.getParameter(debug.UNMASKED_VENDOR_WEBGL);
      const renderer = ctx.getParameter(debug.UNMASKED_RENDERER_WEBGL);
      return vendor + " " + renderer;
    }
    return "";
  } catch (err) {
    return "";
  }
})();

issues.ALWAYS_UNLOCK_AUDIO =
  issues.PLATFORM.name === "Safari" ||
  issues.PLATFORM.layout === "WebKit" ||
  issues.PLATFORM.os.family.indexOf("iOS") !== -1; /* || issues.PLATFORM. */

issues.RESIZE_BUG = issues.PLATFORM.os.family.indexOf("iOS") !== -1;

// not ideal - but all the slow machines in SBS are integrated windows/directx intel GPU machines
issues.IS_DX_INTEL_GPU =
  issues.GPU_VENDOR.toLowerCase().indexOf("intel") !== -1 &&
  issues.GPU_VENDOR.toLowerCase().indexOf("direct3d") !== -1;

issues.IS_INTEL_GPU = issues.GPU_VENDOR.toLowerCase().indexOf("intel") !== -1;
//console.log(issues.IS_INTEL_GPU);

// Note also machines with intel gpus within SBS crawl if try to get them to do
// WebAudio at the same time... so cheat and disable
// WebAudio can also go crazy on older safari and almost blow out a user's
// ear drums if they have their headphones on. Avoid that at all costs!
issues.WEBAUDIO_AVAILABLE =
  !!(window.AudioContext || window.webkitAudioContext) &&
  !issues.IS_DX_INTEL_GPU &&
  !issues.MOBILE &&
  issues.PLATFORM.name !== "Safari";

issues.WEBGL_FAUX_SHADOWS_BROKEN =
  issues.PLATFORM.name.indexOf("Microsoft") !== -1;

issues.REQUIRES_LOW_RES_TEXTURES = (() => {
  //return true;
  if (issues.IS_DX_INTEL_GPU) return true;
  if (ctx && ctx.getParameter(ctx.MAX_TEXTURE_SIZE) <= 4096) return true;
  //if (Math.max(window.innerHeight, window.innerWidth) < 1220) return true;
  if (!window.devicePixelRatio || window.devicePixelRatio <= 1) return true;
  //if (is_firefox && major_version <= 45) return true;
  return false;
})();

issues.REQUIRES_FAST_POST_PROCESSING = (() => {
  return issues.IS_DX_INTEL_GPU;
})();

issues.DISABLE_FULLSCREEN = issues.PLATFORM.name.includes("Safari");

const checkWebM = () => {
  return new Promise((resolve, reject) => {
    var vid = document.createElement("video");
    vid.autoplay = false;
    vid.loop = false;
    vid.style.display = "none";
    vid.addEventListener(
      "loadeddata",
      function () {
        document.body.removeChild(vid);
        // Create a canvas element, this is what user sees.
        var canvas = document.createElement("canvas");

        //If we don't support the canvas, we definitely don't support webm alpha video.
        if (!(canvas.getContext && canvas.getContext("2d"))) {
          resolve(false);
          return;
        }

        // Get the drawing context for canvas.
        var ctx = canvas.getContext("2d");

        // Draw the current frame of video onto canvas.
        ctx.drawImage(vid, 0, 0);
        if (ctx.getImageData(0, 0, 1, 1).data[3] === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      false
    );
    vid.addEventListener("error", function () {
      document.body.removeChild(vid);
      resolve(false);
    });

    vid.addEventListener("stalled", function () {
      document.body.removeChild(vid);
      resolve(false);
    });

    //Just in case
    vid.addEventListener("abort", function () {
      document.body.removeChild(vid);
      resolve(false);
    });

    var source = document.createElement("source");
    source.src =
      "data:video/webm;base64,GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACBRFNm3RALE27i1OrhBVJqWZTrIHlTbuMU6uEFlSua1OsggEjTbuMU6uEHFO7a1OsggHo7AEAAAAAAACqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAADIq17GDD0JATYCNTGF2ZjU3LjU3LjEwMFdBjUxhdmY1Ny41Ny4xMDBEiYhARAAAAAAAABZUrmsBAAAAAAAARq4BAAAAAAAAPdeBAXPFgQGcgQAitZyDdW5khoVWX1ZQOYOBASPjg4QCYloA4AEAAAAAAAARsIFAuoFAmoECU8CBAVSygQQfQ7Z1AQAAAAAAAGfngQCgAQAAAAAAAFuhooEAAACCSYNCAAPwA/YAOCQcGFQAADBgAABnP///NXgndmB1oQEAAAAAAAAtpgEAAAAAAAAk7oEBpZ+CSYNCAAPwA/YAOCQcGFQAADBgAABnP///Vttk7swAHFO7awEAAAAAAAARu4+zgQC3iveBAfGCAXXwgQM=";
    source.addEventListener("error", function () {
      try {
        document.body.removeChild(vid);
      } catch (err) {}
      resolve(false);
    });
    vid.appendChild(source);

    //This is required for IE
    document.body.appendChild(vid);
  });
};

issues.init = async () => {
  if (issues.INITIALISED) return;
  issues.INITIALISED = true;

  issues.WEBM_ALPHA_AVAILABLE = !issues.MOBILE && (await checkWebM());

  const { result } = await canAutoPlay.video();
  issues.AUTOPLAY = result;
};

export default issues;
