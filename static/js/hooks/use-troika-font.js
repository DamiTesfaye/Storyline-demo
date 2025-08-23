import { preloadFont } from "troika-3d-text";
import usePromise from "react-promise-suspense";

const load = (url) => {
  return new Promise((resolve, reject) => {
    preloadFont(
      url,
      "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'\".,!?&$@…‘’“”:",
      () => {
        resolve();
      }
    );
    return () => {
      console.log("Do cleanup!");
    };
  });
};

const useFont = (url) => {
  usePromise(load, [url]);
};

export default useFont;
