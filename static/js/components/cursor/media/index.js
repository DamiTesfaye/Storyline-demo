import { map } from "math/map";
import React, { useEffect, useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import useMedia from "hooks/use-media";
import { useStore } from "hooks/use-store";
import CloseIcon from "./close.svg";
import PlayIcon from "./play.svg";
import MutedIcon from "./muted.svg";

const SvgEl = styled(animated.svg)`
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
  cursor: pointer;
  pointer-events: auto;
  display: none;
  -webkit-tap-highlight-color: transparent;

  circle.svg-circle-bg {
    fill: #000;
  }

  circle.svg-circle-thin {
    fill: none;
    stroke: #fff;
    transform-origin: center;
    transform: rotate(-90deg);
  }

  circle.svg-circle-thick {
    stroke: #fff;
    fill: none;
    stroke-linecap: round;
    transform-origin: center;
    transform: rotate(-90deg);
    transition: stroke-dashoffset 400ms ease-in-out;
  }

  svg {
    path {
      transform: ${(props) =>
        props.ismobile ? "scale(0.6, 0.6)" : "scale(1, 1)"};
    }
  }
`;

const MediaCursor = observer((props) => {
  const history = useHistory();
  const store = useStore();
  const [
    size,
    strokeWidth,
    center,
    radius,
    circumference,
    innerRadius,
    innerCircumference,
  ] = useMemo(() => {
    const size = props.isMobile ? 80 : 110;
    const strokeWidth = props.isMobile ? 5 : 7;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const innerRadius = radius - 8;
    const innerCircumference = 2 * Math.PI * innerRadius;
    return [
      size,
      strokeWidth,
      center,
      radius,
      circumference,
      innerRadius,
      innerCircumference,
    ];
  }, []);

  const [style, setStyle] = useSpring(() => {
    return {
      opacity: 0,
      config: { duration: 200 },
      delay: 200,
    };
  });
  const [bgCircleAttr, setBgCircleAttr] = useSpring(() => {
    return {
      radius,
      config: { duration: 500 },
    };
  });
  const [bgThinAttr, setBgThinAttr] = useSpring(() => {
    return {
      percent: 0,
      config: { duration: 500 },
    };
  });

  const [
    mediaElement,
    play,
    pause,
    seek,
    unmute,
    getMuted,
    getPlayStatus,
  ] = useMedia(props.contentId, store.activeItemType);

  const [playStatus, setPlayStatus] = useState();

  // Only set play status while in an activeId to avoid changing play/pause icons
  // whilst in transitions
  useEffect(() => {
    if (store.activeId) {
      setPlayStatus(getPlayStatus());
    }
  }, [getPlayStatus(), store.activeId]);

  const handleClick = () => {
    switch (getPlayStatus()) {
      case "success":
        history.push("");
        break;
      case "success-muted":
        unmute();
        break;
      case "failed":
      case "none":
        play();
    }
    // Is this required any more?
    // store.setAutoplayState(true);
  };

  useEffect(() => {
    switch (props.animate) {
      case "in":
        setStyle({ opacity: 1, delay: 750 });
        setBgCircleAttr({ radius, delay: 750 });
        setBgThinAttr({ from: { percent: 0 }, percent: 1, delay: 1200 });
        break;
      case "out":
        setStyle({ opacity: 0, delay: 0 });
        setBgCircleAttr({ radius: 0, delay: 0 });
        setBgThinAttr({ percent: 0, delay: 300 });
        break;
    }
  }, [props.animate]);

  const offset = useMemo(() => {
    return (
      map(props.progress, 0, 1, innerCircumference, 0) || innerCircumference
    );
  }, [circumference, props.progress]);

  return (
    <>
      <SvgEl
        ismobile={props.isMobile ? true : undefined}
        onClick={() => {
          handleClick();
        }}
        width={size}
        height={size}
        style={{
          opacity: style.opacity,
          display:
            style.opacity &&
            style.opacity.interpolate((v) => (v > 0 ? "block" : "none")),
        }}
      >
        <animated.circle
          className="svg-circle-bg"
          cx={center}
          cy={center}
          r={bgCircleAttr.radius}
          strokeWidth={0}
        />
        <animated.circle
          className="svg-circle-thin"
          cx={center}
          cy={center}
          r={innerRadius}
          strokeWidth={1}
          strokeDasharray={innerCircumference}
          strokeDashoffset={bgThinAttr.percent.interpolate(
            (v) => innerCircumference * (1 - v)
          )}
        />
        <circle
          className="svg-circle-thick"
          cx={center}
          cy={center}
          r={innerRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={innerCircumference}
          strokeDashoffset={offset}
        />

        {(() => {
          //console.log(getPlayStatus());
          switch (playStatus) {
            case "success":
              return (
                <CloseIcon
                  x={props.isMobile ? 26 : 31}
                  y={props.isMobile ? 26 : 31}
                />
              );
            case "success-muted":
              return (
                <MutedIcon
                  x={props.isMobile ? 26 : 31}
                  y={props.isMobile ? 26 : 31}
                />
              );
            case "failed":
            case "none":
              return (
                <PlayIcon
                  x={props.isMobile ? 30 : 40}
                  y={props.isMobile ? 26 : 33}
                />
              );
          }
        })()}
      </SvgEl>
    </>
  );
});

export default MediaCursor;
