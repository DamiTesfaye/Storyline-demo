import { useSuspendedTextureLoader } from "hooks/use-lazy-texture-loader";
import useWhyDidYouUpdate from "hooks/use-why-did-you-update";
import React from "react";
import materialDefaults from "../material-defaults";
import largeAlphaMap from "./large-alpha-map.png";
import smallAlphaMap from "./small-alpha-map.png";

/* const sharedTexture = new THREE.VideoTexture();
const sharedMaterial = new THREE.MeshBasicMaterial(); */

const Player = (props) => {
  useWhyDidYouUpdate("Player", props);

  const alphaMap = useSuspendedTextureLoader(
    props.isMain ? largeAlphaMap : smallAlphaMap
  );

  return (
    <group position={props.position} renderOrder={6} visible={props.isActive}>
      <mesh position={[0, 0, 0]}>
        <planeBufferGeometry
          attach="geometry"
          args={[props.dimensions[0] + 0.005, props.dimensions[1] + 0.005]}
        />
        <meshStandardMaterial {...materialDefaults} alphaMap={alphaMap}>
          <videoTexture attach="map" image={props.video} />
        </meshStandardMaterial>
      </mesh>
    </group>
  );
};

export default Player;
