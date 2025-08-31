import { preloadFont } from "troika-3d-text";
import usePromise from "react-promise-suspense";

const load = (url: string): Promise<void> => {
  return new Promise((resolve) => {
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

const useFont = (url: string): void => {
  usePromise(load, [url]);
};

export default useFont;
