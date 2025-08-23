import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import src from "./the-feed-logo.svg";
import { useSpring, animated } from "react-spring";
import { easeOutCubic, easeOutQuint } from "math/map";

const flicker = keyframes`
    0% {
      filter: invert(0%);
    }   
     50% {
      filter: invert(40%);
    }
    100% {
      filter: invert(0%);
    }  
`;

const LogoDiv = animated(styled.div`
  overflow: hidden;
  position: absolute;
  height: 75px;
  top: 30px;
  left: 30px;

  .content {
    position: absolute;
    top: 0;
    display: block;
    white-space: pre;

    a {
      -webkit-user-drag: none;
    }

    img {
      width: 180px;
      /* filter: invert(100%); */
      &:hover {
        animation-name: ${flicker};
        animation-duration: 0.05s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      @media (max-width: 768px) {
        width: 115px;
      }
    }
  }
`);

const Logo = (props) => {
  const content = useRef();

  const [contentWidth, setContentWidth] = useState(0);

  const [style, setStyle] = useSpring(() => {
    return {
      width: 0,
      config: { duration: 800, easing: easeOutQuint },
    };
  });

  const [opacity, setOpacity] = useSpring(() => {
    return {
      opacity: 0,
      config: { duration: 500, easing: easeOutCubic },
    };
  });

  useEffect(() => {
    if (content.current) setContentWidth(content.current.clientWidth);
  }, []);

  useLayoutEffect(() => {
    const updateLogoWidth = (e) => {
      if (content.current) setContentWidth(content.current.clientWidth);
    };
    window.addEventListener("resize", updateLogoWidth);
    return () => {
      window.removeEventListener("resize", updateLogoWidth);
    };
  }, []);

  useEffect(() => {
    if (props.animate == "in") {
      setStyle({ width: contentWidth });
      setOpacity({ opacity: 1 });
    } else {
      setStyle({ width: 0 });
      setOpacity({
        opacity: 0,
        delay: 100,
        config: { duration: 100 },
      });
    }
  }, [props.animate, contentWidth]);

  return (
    <LogoDiv
      style={{
        width: style.width,
        opacity: opacity.opacity,
      }}
    >
      <div ref={content} className="content">
        <a
          href="https://www.sbs.com.au/thefeed"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img draggable="false" src={src} alt="The Feed" />
        </a>
      </div>
    </LogoDiv>
  );
};

export default Logo;
