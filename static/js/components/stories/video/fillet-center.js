import React from "react";
import * as THREE from "three";
import FilletCorner from "./fillet-corner";

const FilletCenter = (props) => {
  const getRotation = (orientation) => {
    const z = {
      cl: 0,
      cr: Math.PI * -1,
    }[orientation];
    return new THREE.Euler(0, 0, z);
  };

  return (
    <group rotation={getRotation(props.orientation)} position={props.position}>
      <FilletCorner orientation={"tl"} />
      <FilletCorner orientation={"bl"} />
    </group>
  );
};

export default FilletCenter;
