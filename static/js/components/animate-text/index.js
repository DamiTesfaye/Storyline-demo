import React, { useEffect, useMemo } from "react";
import { animated, useTrail } from "react-spring";

const AnimateText = (props) => {
  const { className = "" } = props;

  const words = useMemo(() => {
    return props.children.toString().split(" ");
  }, [props.children]);

  const [springs, set] = useTrail(words.length, (index) => ({
    opacity: 0,
    config: { mass: 1, friction: 25, tension: 150 },
  }));

  useEffect(() => {
    if (props.animate == "in") {
      set({
        delay: 600,
        opacity: 1,
      });
    } else {
      set({ opacity: 0 });
    }
  }, [props.animate]);

  return (
    <span className={className}>
      {springs.map((props, i) => (
        <animated.span key={i} style={props}>
          {`${words[i]} `}
        </animated.span>
      ))}
    </span>
  );
};

export default AnimateText;
