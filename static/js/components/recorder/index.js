import AnimateText from "components/animate-text";
import { easeOutCubic, easeOutQuint } from "math/map";
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import styled, { keyframes } from "styled-components";

const flash = keyframes`
    0% {
      opacity: 0;
    }
    1% {
      opacity: 1;
    }
    8% {
      opacity: 0;
    }
    9% {
      opacity: 1;
    }
    16% {
      opacity: 0;
    }
    17% {
      opacity: 1;
    }
    24% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    } 
    100% {
      opacity: 1;
    }
`;

const flicker = keyframes`
    0% {
      background: #fff;
    }   
     50% {
      background: #efefef;
    }
    100% {
      background: #fff;
    }  
`;

const RecorderDiv = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  font-family: "Neue Machina", sans-serif;
  color: #fff;
  letter-spacing: 0px;
  font-size: 1.2em;

  @media (max-width: 768px) {
    left: 0;
    right: 0;
    bottom: 15px;
    display: flex;
    justify-content: center;
    font-size: 0.8em;
  }

  div {
    white-space: pre;
  }

  div.recorder {
    display: flex;
    align-items: center;
    background: #000;
    border-radius: 100px;
    height: 33px;
    overflow: hidden;

    div.recorder-content {
      display: flex;
      align-items: center;
      position: relative;
      right: 0;
      @media (max-width: 768px) {
        position: relative;
        right: auto;
      }
    }

    div.recorder-text {
      padding: 0 0 0 15px;
      height: 100%;
    }

    div.record-button-container {
      height: 100%;
      display: inline-block;
      font-family: "Neue Machina", sans-serif;
      background: white;
      border-radius: 100px;
      margin: 0 3px 0 5px;

      &:hover {
        animation-name: ${flicker};
        animation-duration: 0.1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      a {
        text-decoration: none;
      }

      div.record-button {
        display: flex;
        align-items: center;
        padding: 0 8px;
        color: #000;
        font-weight: bold;
        padding-left: 2px;
        overflow: hidden;
        cursor: pointer;

        div.record-dot {
          background: rgb(173, 0, 0);
          border-radius: 50%;
          margin-left: 5px;
          width: 13px;
          height: 13px;
          opacity: 0;
          display: inline-block;
          animation-name: ${flash};
          animation-duration: 4s;
          animation-iteration-count: infinite;
        }

        span {
          margin: 0px 5px;
          margin-top: 1px;
        }
      }
    }
  }
`;

const Recorder = (props) => {

  const content = useRef();

  const [contentWidth, setContentWidth] = useState(0);

  const refCallback = (element) => {
    if (element) {
      content.current = element;
      setContentWidth(element.clientWidth);
    }
  }

  const [recorderStyle, setRecorderStyle] = useSpring(() => {
    return {
      width: 0,
      config: { duration: 800, easing: easeOutQuint },
    };
  });

  const [buttonStyle, setButtonStyle] = useSpring(() => {
    return {
      height: 0,
      config: { duration: 400, easing: easeOutQuint },
    };
  });

  const [recorderOpacity, setRecorderOpacity] = useSpring(() => {
    return {
      opacity: 0,
      config: { duration: 500, easing: easeOutCubic },
    };
  });

  useLayoutEffect(() => {
    const updateRecorderWidth = (e) => {
      if (content.current) setContentWidth(content.current.clientWidth);
    };
    window.addEventListener("resize", updateRecorderWidth);
    return () => {
      window.removeEventListener("resize", updateRecorderWidth);
    };
  }, []);

  useEffect(() => {
    if (props.animate == "in") {
      setRecorderStyle({ width: contentWidth });
      setRecorderOpacity({ opacity: 1 });
      setButtonStyle({
        from: { height: 0 },
        delay: 500,
        height: 27,
      });
    } else {
      setRecorderStyle({ width: 0 });
      setRecorderOpacity({
        opacity: 0,
        delay: 100,
        config: { duration: 100 },
      });
      setButtonStyle({
        delay: 500,
        height: 0,
      });
    }
  }, [props.animate, contentWidth]);

  return (
    <RecorderDiv>
      <animated.div
        style={{
          opacity: recorderOpacity.opacity,
          width: recorderStyle.width.interpolate((v) => `${v}px`),
        }}
        className="recorder"
      >
        <div ref={refCallback} className="recorder-content">
          <div className="recorder-text">
            <AnimateText animate={props.animate}>Leave your story.</AnimateText>
          </div>
          <div className="record-button-container">
            <a href="tel:18008433333">
              <animated.div
                style={{
                  height: buttonStyle.height.interpolate((v) => `${v}px`),
                }}
                className="record-button"
              >
                <div className="record-dot"></div>
                <span>1800 843 3333</span>
              </animated.div>
            </a>
          </div>
        </div>
      </animated.div>
    </RecorderDiv>
  );
};

export default Recorder;
