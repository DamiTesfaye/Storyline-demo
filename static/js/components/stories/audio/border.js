import React, { useRef } from "react";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "threejs-meshline";
import FilletCorner from "../video/fillet-corner";
import { isEqual } from "lodash";
import { PlaneGeometry } from "three";
extend(MeshLine, MeshLineMaterial, MeshLineRaycast);

const shared = {
  geometry: new THREE.PlaneGeometry(0.01, 1),
  material: new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }),
};
/* const vertices = [new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)];
shared.geometry.setVertices(vertices); */

const Border = (props) => {
  const group = useRef();
  return (
    <group position={props.position} ref={group}>
      <FilletCorner position={[0, 0.5, 0]} orientation="tl" />
      <FilletCorner position={[0, 0.5, 0]} orientation="tr" />
      <FilletCorner position={[0, -0.5, 0]} orientation="bl" />
      <FilletCorner position={[0, -0.5, 0]} orientation="br" />
      <mesh>
        <primitive object={shared.material} attach="material" />
        <primitive object={shared.geometry} attach="geometry" />
      </mesh>
    </group>
  );
};

//export default Border;

export default React.memo(Border, (before, after) => {
  const position = isEqual(before.position, after.position);
  return position;
});
