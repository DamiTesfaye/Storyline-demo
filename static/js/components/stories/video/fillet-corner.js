import { useSuspendedTextureLoader } from "hooks/use-lazy-texture-loader";
import React from "react";
import * as THREE from "three";
import materialDefaults from "../material-defaults";
import img from "./fillet-alpha-map.png";

const size = 0.2;
const antialiasFix = 0.0015;
const shared = {
  geometry: new THREE.PlaneBufferGeometry(size, size),
  material: new THREE.MeshBasicMaterial({
    color: "white",
    flatShading: true,
    transparent: true,
  }),
};

shared.geometry.translate(
  size * -0.5 + antialiasFix,
  size * 0.5 - antialiasFix,
  0
);

const FilletCorner = (props) => {
  //const map = useTextureLoader(img, []);
  const map = useSuspendedTextureLoader(img);

  const getRotation = (orientation) => {
    const z = {
      tl: Math.PI * -1.5,
      tr: Math.PI * -1,
      br: Math.PI * -0.5,
      bl: 0,
    }[orientation];
    return new THREE.Euler(0, 0, z);
  };

  return (
    <mesh
      renderOrder={0}
      rotation={getRotation(props.orientation)}
      position={props.position}
    >
      <meshBasicMaterial
        {...materialDefaults}
        attach="material"
        alphaMap={map}
        color={"white"}
        depthWrite={false}
        depthTest={false}
        transparent={true}
      />
      <primitive object={shared.geometry} attach="geometry" />
    </mesh>
  );
};

export default FilletCorner;
