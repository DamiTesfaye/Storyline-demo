import { easeInQuint } from "math/map";
import React, { useEffect, useRef } from "react";
import { animated, interpolate, useSpring } from "react-spring";
import styled from "styled-components";

const ClipContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 998;
  mix-blend-mode: screen;
  pointer-events: none;
`;

const ClippingRect = (props) => {
  const svg = useRef();

  const [clipPath, setClipPath] = useSpring(() => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 0,
      height: 0,
      angle: 8,
      config: {
        easing: easeInQuint,
        duration: 2000,
      },
    };
  });

  useEffect(() => {
    if (props.ready) {
      setClipPath({
        width: Math.max(window.innerWidth, window.innerHeight) + 40,
        height: Math.max(window.innerWidth, window.innerHeight) + 40,
        angle: 0,
        onRest: (v) => {
          if (v.angle === 0) svg.current.style.display = "none";
        },
      });
    }
  }, [props.ready]);

  return (
    <ClipContainer>
      <svg
        ref={svg}
        style={{ width: "100%", height: "100%" }}
        width="100%"
        height="100%"
        viewBox="0 0 100% 100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x={0} y={0} width={"100%"} height={"100%"} fill="white" />
        <g
          transform={`translate(${window.innerWidth / 2} ${
            window.innerHeight / 2
          })`}
        >
          <animated.rect
            width={clipPath.width}
            height={clipPath.height}
            fill="black"
            rx="25"
            transform={interpolate(
              [clipPath.angle, clipPath.width, clipPath.height],
              (angle, width, height) => {
                return `
              translate(${width * -0.5} ${height * -0.5}) 
              rotate(${angle} ${width * 0.5} ${height * 0.5})
              `;
              }
            )}
          />
        </g>
      </svg>
    </ClipContainer>
  );
};

export default ClippingRect;
