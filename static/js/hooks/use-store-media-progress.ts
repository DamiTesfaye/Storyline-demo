import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useStoreMediaProgress = (
  mediaEl: HTMLMediaElement,
  store: { setMediaProgress: (progress: number) => void }
) => {
  const history = useHistory();
  useEffect(() => {
    let progress = -1;
    const precision = 300;
    const setMediaProgressFromEvent = (e: Event & { target: HTMLMediaElement }) => {
      const newProgress =
        Math.round((e.target.currentTime / e.target.duration) * precision) /
        precision;
      if (newProgress != progress) {
        store.setMediaProgress(newProgress);
        progress = newProgress;
      }
    };
    const resetMediaProgress = () => {
      store.setMediaProgress(0);
      progress = 0;
    };
    const closeMedia = () => {
      history.push("");
    };
    mediaEl.addEventListener("timeupdate", setMediaProgressFromEvent);
    mediaEl.addEventListener("pause", resetMediaProgress);
    mediaEl.addEventListener("ended", closeMedia);
    return () => {
      mediaEl.removeEventListener("timeupdate", setMediaProgressFromEvent);
      mediaEl.removeEventListener("pause", resetMediaProgress);
      mediaEl.removeEventListener("ended", closeMedia);
    };
  }, [mediaEl]);
};

export default useStoreMediaProgress;
