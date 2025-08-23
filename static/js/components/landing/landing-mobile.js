import font from "assets/fonts/neue-machina/neue-machina-light.woff";
import fontBold from "assets/fonts/neue-machina/neue-machina-bold.woff";
import Label from "components/label";
import materialDefaults from "components/stories/material-defaults";
import useTextureLoader from "hooks/use-texture-loader";
import React, { useEffect, useRef } from "react";
import leftify from "./leftify";
import logoSrc from "./the-feed-1024.png";
import titleSrc from "./title-2048.png";

const labelDefaults = {
  color: 0x000000,
  fontSize: 0.07 * 2,
  lineHeight: 1.33,
  textAlign: "left",
  font,
  anchorX: "left",
  anchorY: "middle",
  maxWidth: 2.65,
};

const Landing = (props) => {
  const [logoTexture, titleTexture] = useTextureLoader([logoSrc, titleSrc]);
  const logo = useRef();
  const title = useRef();

  useEffect(() => {
    if (logo.current && title.current) {
      leftify(logo.current.geometry);
      leftify(title.current.geometry);
    }
  }, []);

  return (
    <group>
      {/* 933 x 266 */}
      <mesh
        ref={logo}
        position={[-1.05, 2, 0]}
        scale={[0.35, 0.35, 1]}
        renderOrder={10}
      >
        <planeBufferGeometry attach="geometry" args={[3.5, 1]} />
        <meshBasicMaterial
          attach="material"
          map={logoTexture}
          {...materialDefaults}
        />
      </mesh>

      {/* 2293 x 368 */}
      <mesh
        ref={title}
        position={[-1.05, 0.95, 0]}
        scale={[0.45, 0.45, 1]}
        renderOrder={10}
      >
        <planeBufferGeometry attach="geometry" args={[6.22, 1]} />
        <meshBasicMaterial
          attach="material"
          map={titleTexture}
          {...materialDefaults}
        />
      </mesh>
      <group position={[-1.05, 0.04, 0]}>
        <Label {...labelDefaults}>
          When the world went into lockdown, The Feed set up a phone line to
          receive voice memos from all\nover Australia.
        </Label>
      </group>

      <group position={[-1.05, -1, 0]}>
        <Label {...labelDefaults}>
          This is the story of COVID-19, as told by you.
        </Label>
      </group>

      <group position={[-1.05, -2, 0]}>
        <Label {...labelDefaults} font={fontBold}>
          Swipe to explore
        </Label>
      </group>
    </group>
  );
};

export default Landing;
