import React from "react";
import * as THREE from "three";

const shared = {
  geometry: new THREE.PlaneGeometry(1000, 0.01),
  material: new THREE.MeshBasicMaterial({ color: "white", flatShading: true }),
};

const Line = (props) => {
  return (
    <mesh position={props.position} position-z={-0.001}>
      <primitive object={shared.material} attach="material" />
      <primitive object={shared.geometry} attach="geometry" />
    </mesh>
  );
};

export default Line;
