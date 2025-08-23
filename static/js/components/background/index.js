import useTextureLoader from "hooks/use-texture-loader";
import React from "react";
import * as THREE from "three";
import url from "./map.png";

const Background = (props) => {
  const map = useTextureLoader(url);

  if (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat = new THREE.Vector2(70, 70);
  }

  return (
    <mesh position={props.position}>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshStandardMaterial
        attach="material"
        side={THREE.FrontSide}
        flatShading={true}
        map={map}
      ></meshStandardMaterial>
    </mesh>
  );
};

export default Background;
