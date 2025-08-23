import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useStoreMediaProgress = (mediaEl, store) => {
  const history = useHistory();
  useEffect(() => {
    let progress = -1;
    const precision = 300;
    const setMediaProgressFromEvent = (e) => {
      const newProgress =
        Math.round((e.target.currentTime / e.target.duration) * precision) /
        precision;
      if (newProgress != progress) {
        store.setMediaProgress(newProgress);
        progress = newProgress;
      }
    };
    const resetMediaProgress = (e) => {
      store.setMediaProgress(0);
      progress = 0;
    }
    const closeMedia = () => {
      history.push("");
    }
    mediaEl.addEventListener("timeupdate", setMediaProgressFromEvent);
    mediaEl.addEventListener("pause", resetMediaProgress);
    mediaEl.addEventListener("ended", closeMedia);
    return () => {
      mediaEl.removeEventListener("timeupdate", setMediaProgressFromEvent);
      mediaEl.removeEventListener("pause", resetMediaProgress);
      mediaEl.addEventListener("ended", closeMedia);
    };
  }, [mediaEl]);
};
export default useStoreMediaProgress;
