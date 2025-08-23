import issues from "services/issues";
import glQuality from "services/gl-quality";
import mem from "mem";
import analyser from "components/stories/audio/analyser";

/* let sharedVideo = document.createElement("video");
let sharedAudio = document.createElement("audio"); */

const get = mem((id, type) => {
  let isPlaying = false;
  let playStatus = "none";

  const mediaElement = document.createElement(type);

  mediaElement.src =
    type === "video"
      ? `videos/${id}-${
          glQuality.get() <= glQuality.LOW || issues.MOBILE ? "512" : "1024"
        }.mp4`
      : `audio/${id}.mp3`;

  if (type === "video") mediaElement.playsInline = true;
  mediaElement.preload = "none";

  const play = () => {
    if (!isPlaying) {
      analyser.resume();
      mediaElement.muted = false;
      mediaElement
        .play()
        .then(() => {
          //console.log("Play was successful.");
          playStatus = "success";
          isPlaying = true;
        })
        .catch((e) => {
          // console.log("Play was not successful, attempting to play muted.");
          //console.log(e);
          playStatus = "success-muted";
          isPlaying = true;
          mediaElement.muted = true;
          mediaElement.play().catch(() => {
            // console.log("No attempts at playing working worked");
            playStatus = "failed";
            isPlaying = false;
          });
        });
    }
  };

  const pause = () => {
    if (isPlaying) {
      isPlaying = false;
      mediaElement.pause();
    }
  };

  const seek = (currentTime) => {
    // console.log("seek?", currentTime);
    mediaElement.currentTime = currentTime;
  };

  const unmute = () => {
    mediaElement.muted = false;
    // This is a bit of an assumption that this worked...
    playStatus = "success";
  };

  const getMuted = () => {
    if (!mediaElement) return true;
    return mediaElement.muted;
  };

  const getPlayStatus = () => {
    return playStatus;
  };

  return [mediaElement, play, pause, seek, unmute, getMuted, getPlayStatus];
});

const useMedia = (id, type) => {
  const result = get(id, type);
  return [...result];
};

export default useMedia;
