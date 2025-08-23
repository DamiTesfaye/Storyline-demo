import React, { useEffect } from "react";
import { animated, useSpring, interpolate } from "react-spring";
import styled from "styled-components";
import { easeInQuint, easeOutQuint } from "math/map";

const DragDiv = styled(animated.div)`
  position: absolute;
  display: inline-block;
  transform-origin: left center;
  border-radius: 100px;
  background-color: #000;
  font-family: "Neue Machina", sans-serif;
  font-weight: bold;
  font-size: 1.2em;
  color: #fff;
  opacity: 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  /* display: none; */

  .message {
    padding: 10px 25px;
  }

  .location {
    font-weight: normal;
  }
`;

const DragCursor = (props) => {
  const [style, setStyle] = useSpring(() => {
    return {
      opacity: 0,
    };
  });

  const [sideStyle, setSideStyle] = useSpring(() => {
    return {
      translateX: 0,
      distanceX: 30,
      config: { mass: 1, tension: 90, friction: 25 },
    };
  });

  useEffect(() => {
    if (props.moveLeft) {
      setSideStyle({ translateX: -100, distanceX: -30 });
    } else {
      setSideStyle({ translateX: 0, distanceX: 30 });
    }
  }, [props.moveLeft]);

  useEffect(() => {
    switch (props.animate) {
      case "in":
        setStyle({
          opacity: 1,
          delay: props.animationDelay,
          config: { duration: 200, easing: easeOutQuint },
        });
        break;
      case "out":
        setStyle({
          opacity: 0,
          delay: 0,
          config: { duration: 300, easing: easeInQuint },
        });
        break;
    }
  }, [props.animate]);

  return (
    <DragDiv
      style={{
        opacity: style.opacity,
        transform: interpolate(
          [sideStyle.translateX, sideStyle.distanceX],
          (translateX, distanceX) =>
            `translateX(${translateX}%) translateX(${distanceX}px) translateY(-50%)`
        ),
      }}
    >
      <div className="message">{props.children}</div>
    </DragDiv>
  );
};

export default DragCursor;
