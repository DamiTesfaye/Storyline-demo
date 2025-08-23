import { useStore } from "hooks/use-store";
import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import AnimateText from "components/animate-text";
import HomeIcon from "./home.svg";

const HomeDiv = animated(styled.div`
  position: absolute;
  font-weight: normal;
  user-select: none;
  pointer-events: auto;
  cursor: pointer;
  display: none;

  div.container {
    display: flex;
    align-items: center;
    transform: translate(-30px, -50%);

    @media (max-width: 768px) {
      transform: none;
    }

    .cta {
      font-family: "Neue Machina";
      font-size: 1.2rem;
      white-space: pre;
      margin-left: 10px;

      @media (max-width: 768px) {
        font-size: 0.8rem;
      }
    }
  }
`);

const SvgEl = styled(animated.svg)`
  display: block;
  opacity: 0;
  -webkit-tap-highlight-color: transparent;

  circle.svg-circle-bg {
    fill: #fff;
  }

  circle.svg-circle-thin {
    fill: none;
    stroke: #000;
  }
`;

const HomeCursor = (props) => {
  const store = useStore();

  const [style, setStyle] = useSpring(() => {
    return {
      opacity: 0,
      config: { duration: 200 },
      delay: 50,
    };
  });
  const [bgCircleAttr, setBgCircleAttr] = useSpring(() => {
    return {
      radius: 0,
      config: { duration: 500 },
    };
  });

  const handleClick = () => {
    store.setRequestHome(true);
  };

  useEffect(() => {
    switch (props.animate) {
      case "in":
        setStyle({ opacity: 1, delay: 1500 });
        setBgCircleAttr({ radius: 28, delay: 1500 });
        break;
      case "out":
        setStyle({ opacity: 0, delay: 0 });
        setBgCircleAttr({ radius: 0, delay: 0 });
        break;
    }
  }, [props.animate]);

  return (
    <HomeDiv
      style={{
        display:
          style.opacity &&
          style.opacity.interpolate((v) => (v > 0 ? "block" : "none")),
      }}
    >
      <div
        onClick={() => {
          handleClick();
        }}
        className="container"
      >
        <SvgEl width={60} height={60} style={style}>
          <animated.circle
            className="svg-circle-bg"
            cx={30}
            cy={30}
            r={bgCircleAttr.radius}
            strokeWidth={0}
          />
          <circle
            className="svg-circle-thin"
            cx={30}
            cy={30}
            r={23}
            strokeWidth={1}
          />
          <HomeIcon x={18} y={20} />
        </SvgEl>
        <div className="cta">
          <AnimateText animate={props.animate}>
            Return to Story Line.
          </AnimateText>
        </div>
      </div>
    </HomeDiv>
  );
};

export default HomeCursor;
