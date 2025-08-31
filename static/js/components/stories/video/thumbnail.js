import useLazyTextureLoader, {
  useSuspendedTextureLoader,
} from "hooks/use-lazy-texture-loader";
import useWhyDidYouUpdate from "hooks/use-why-did-you-update";
import { isEqual } from "lodash";
import { lerp } from "math";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSpring } from "react-spring";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import largeAlphaMap from "./large-alpha-map.png";
import smallAlphaMap from "./small-alpha-map.png";
import ThumbnailMaterial from "./thumbnail-material";

const screenPosition = (camera, object3d) => {
  if (!object3d || !camera) return;
  let worldPosition = new THREE.Vector3();
  worldPosition = object3d.localToWorld(worldPosition);
  worldPosition.project(camera);
  return worldPosition;
};

const Thumbnail = (props) => {
  // useWhyDidYouUpdate("Thumbnail", props);
  const mesh = useRef();
  const material = useRef();

  const [offset] = useSpring(() => {
    return {
      x: 0,
      y: 0,
      config: { precision: 0.0001, mass: 1, tension: 25, friction: 15 },
    };
  });

  const alphaMap = useSuspendedTextureLoader(
    props.isMain ? largeAlphaMap : smallAlphaMap
  );

  const map = useLazyTextureLoader(
    `images/${props.id}-0${props.thumbOrder[props.index]}-${
      props.isMain ? "512" : "256"
    }.jpg`
  );

  const [animate, setAnimate] = useState("none");
  const [hasDoneInitialAnimation, setHasDoneIntitialAnimation] = useState(
    false
  );

  useEffect(() => {
    if (map && !hasDoneInitialAnimation) {
      setAnimate("in-initial");
      setHasDoneIntitialAnimation(true);
    } else {
      setAnimate(props.animate);
    }
  }, [map, props.animate]);

  useEffect(() => {
    if (props.isOver) {
      setAnimate("rollover");
    } else {
      setAnimate("rollout");
    }
  }, [props.isOver]);

  useFrame((state) => {
    if (props.isOnScreen && mesh.current) {
      const result = screenPosition(state.camera, mesh.current);
      const multiplier = props.isMain ? 0.1 : 0.15;
      /* setOffset({ x: result.x * multiplier, y: result.y * multiplier }); */
      // reach into the guts of the material and set some uniforms lol
      const mat = material.current;
      if (mat) {
        const uniforms = mat.uniforms;
        uniforms.uOffset.value.set(
          lerp(uniforms.uOffset.value.x, result.x * multiplier, 0.1),
          lerp(uniforms.uOffset.value.y, result.y * multiplier, 0.1)
        );
      }
    }
  });

  return (
    <Suspense fallback={null}>
      <mesh ref={mesh} position={[0, 0, 0]} renderOrder={6}>
        <planeBufferGeometry attach="geometry" args={props.dimensions} />
        <meshBasicMaterial color="white" />
        <ThumbnailMaterial
          ref={material}
          index={props.index}
          attach="material"
          offset={offset}
          animate={animate}
          isOver={props.isOver}
          map={map}
          alphaMap={alphaMap}
        />
      </mesh>
    </Suspense>
  );
};

//export default Thumbnail;

export default React.memo(Thumbnail, (before, after) => {
  // console.log(before, after);
  const id = before.id && after.id;
  const animate = before.animate && after.animate;
  const thumbOrder = before.thumbOrder && after.thumbOrder;
  const isMain = before.isMain && after.isMain;
  const isOver = before.isOver && after.isOver;
  const isOnScreen = before.isOnScreen && after.isOnScreen;
  const dimensions = isEqual(before.dimensions, after.dimensions);
  return (
    id && animate && thumbOrder && isMain && isOver && isOnScreen && dimensions
  );
});
