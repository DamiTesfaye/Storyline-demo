import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useThree } from "@react-three/fiber";

const FixedHTML = React.forwardRef((props, ref) => {
  const { children, styles, className, prepend, portal } = props;
  const { gl } = useThree();
  const [el] = useState(() => document.createElement("div"));
  const group = useRef(null);
  const target = (portal && portal.current) || gl.domElement.parentNode;

  useEffect(() => {
    if (group.current) {
      if (target) {
        if (prepend) target.prepend(el);
        else target.appendChild(el);
      }
      return () => {
        if (target) target.removeChild(el);
        ReactDOM.unmountComponentAtNode(el);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => {
    ReactDOM.render(
      <div
        ref={ref}
        style={styles}
        className={className}
        children={children}
      />,
      el
    );
  });

  return <group ref={group} />;
});

export default FixedHTML;
