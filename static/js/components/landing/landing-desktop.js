import font from "assets/fonts/neue-machina/neue-machina-light.woff";
import Label from "components/label";
import materialDefaults from "components/stories/material-defaults";
import useTextureLoader from "hooks/use-texture-loader";
import { default as React, useEffect, useRef } from "react";
import leftify from "./leftify";
import logoSrc from "./the-feed-1024.png";
import titleSrc from "./title-2048.png";
import AudioStoryMaterial from "components/stories/audio/audio-story-material";

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

  const handleHover = (evt) => {
    evt.stopPropagation();
  };

  return (
    <group>
      {/* Create an invisible mesh over the landing area
        on desktop, this will capture hover events and prevent the
        rollover from being set over this area */}
      <mesh
        visible={false}
        position={[0, 0, 0.01]}
        onPointerOver={(e) => handleHover(e)}
        onPointerOut={(e) => handleHover(e)}
      >
        <planeBufferGeometry attach="geometry" args={[5.4, 2.7]} />
      </mesh>
      {/* 933 x 266 */}
      <mesh
        ref={logo}
        position={[-2 + 0.005, 1, 0]}
        scale={[0.45, 0.45, 1]}
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
        position={[-2, 0, 0]}
        scale={[0.75, 0.75, 1]}
        renderOrder={10}
      >
        <planeBufferGeometry attach="geometry" args={[6.22, 1]} />
        <AudioStoryMaterial map={titleTexture} animate="in-intro" />
        {/*         <meshBasicMaterial
          attach="material"
          map={titleTexture}
          {...materialDefaults}
        /> */}
      </mesh>

      <Label
        position={[-2, -0.65, 0]}
        color={0x000000}
        fontSize={0.066 * 2}
        lineHeight={1.33}
        textAlign="left"
        font={font}
        anchorX="left"
        anchorY="top"
        maxWidth={5}
      >
        When the world went into lockdown, The Feed set up a phone line to
        receive voice memos from all over Australia.
      </Label>

      <Label
        position={[-2, -1.13, 0]}
        color={0x000000}
        fontSize={0.066 * 2}
        lineHeight={1.33}
        textAlign="left"
        font={font}
        anchorX="left"
        anchorY="top"
        maxWidth={5}
      >
        This is the story of COVID-19, as told by you.
      </Label>
    </group>
  );
};

export default Landing;
