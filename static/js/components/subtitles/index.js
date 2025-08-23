import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import createElement from "utils/create-element";
import issues from "services/issues";

const StyledSubtitles = styled.div`
  display: flex;
  flex-wrap: nowrap;
  font-family: "Neue Machina";
  font-size: 1.6rem;
  font-weight: normal;
  justify-content: center;
  position: relative;
  text-align: center;
  top: 39vh;
  width: 580px;
  user-select: none;
  .text {
    background-color: black;
    border-radius: 15px;
    color: white;
    display: none;
    padding: 18px 15px;
  }
  @media (max-width: 768px) {
    font-size: 0.8rem;
    width: 65vw;
    margin-right: ${() => (issues.MOBILE ? "20px" : "0px")};
    margin-bottom: 30px;
    top: 0;
  }
`;

const Subtitles = ({ video, vttURL }) => {
  const subtitles = useRef();
  const text = useRef();

  useEffect(() => {
    let track;

    const addSubtitles = (video, vttURL) => {
      track = createElement(
        `<track label="English" kind="captions" srclang="en" src=${vttURL} default>`
      );
      video.appendChild(track);
      track.oncuechange = (e) => {
        const cues = e.target.track.activeCues;
        if (cues && cues.length) {
          text.current.innerHTML = cues[0].text;
          text.current.style.display = "inline-block";
        } else {
          text.current.innerHTML = "";
          text.current.style.display = "none";
        }
      };
    };

    const removeSubtitles = (video) => {
      track.oncuechange = null;
      video.removeChild(track);
      text.current.innerHTML = "";
    };

    addSubtitles(video, vttURL);
    return () => {
      removeSubtitles(video);
    };
  }, [video, vttURL]);

  return (
    <StyledSubtitles ref={subtitles}>
      <div className="text" ref={text}></div>
    </StyledSubtitles>
  );
};

export default Subtitles;
