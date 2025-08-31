import { useSuspendedTextureLoader } from "hooks/use-lazy-texture-loader";
import { clamp } from "lodash";
import { lerp } from "math";
import { interpolate } from "math/array";
import { easeInOutQuint, map } from "math/map";
import { default as React, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import analyser from "./analyser";
import phoneImageSrc from "./phone.png";

const numSamples = 128;

const getGeometry = () => {
  const vertices = [];
  const geometry = new THREE.BufferGeometry();
  for (let i = 0; i < numSamples; i++) {
    const x = map(i, 0, numSamples, -1024, 1024);
    const y = 0;
    const z = 0;
    vertices.push(x, y, z);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  return geometry;
};

const updateGeometry = (geometry, audioData, elapsedTime, lerpStrength) => {
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.array.length; i += positions.itemSize) {
    const sample = audioData[i / 3];
    const direction = i % 2 ? -1 : 1;
    const wave = Math.sin(elapsedTime * 5 + i * 1) * 0.12;
    const newSample = map(sample + wave, 0, 1, 0, 150 * direction);
    positions.array[i + 1] = lerp(
      positions.array[i + 1],
      newSample,
      lerpStrength
    );
  }
  positions.needsUpdate = true;
};

const disposeGeometry = (geometry) => {
  //geometry.dispose();
};

const getFiltering = (quality) => ({ high: 340, low: 860 }[quality]);

const Visualiser = (props) => {
  //const phoneTexture = useTextureLoader(phoneImageSrc);
  const phoneTexture = useSuspendedTextureLoader(phoneImageSrc);

  const group = useRef();
  const sphere = useRef();
  const phone = useRef();

  const [
    geometry1,
    geometry2,
    geometry3,
    geometry4,
    geometry5,
    geometry6,
  ] = useMemo(() => {
    return [
      getGeometry(),
      getGeometry(),
      getGeometry(),
      getGeometry(),
      getGeometry(),
      getGeometry(),
    ];
  }, []);

  useEffect(() => {
    if (props.audio) {
      analyser.setEl(props.audio);
    }
    return () => {
      /* analyser.release(); */
    };
  }, [props.audio]);

  useFrame((state) => {
    if (analyser) {
      const data = analyser.audioData;
      if (!data) return;

      // Trim the low/high bands - thats just inaudible noise for most people. Depending
      // on the quality of the recording we may have to trim more or less - ie. an old school
      // landline has a much tighter range, so we trim out more redundant audio so that the
      // visualisation doesn't look flat on the left and right sides
      const filterHigh = getFiltering(props.audioQuality || "high");
      const filterLow = 20;
      let modifiedData = [...data];
      modifiedData = modifiedData.slice(0, modifiedData.length - filterHigh);
      modifiedData = modifiedData.slice(filterLow);

      // Create a symetrical version of the data - cos it looks nicer :)
      const modifiedDataRight = interpolate(modifiedData, numSamples * 0.5);
      const modifiedDataLeft = [...modifiedDataRight].reverse();

      // Join the left and right
      const joinedAudioData = [...modifiedDataLeft, ...modifiedDataRight];

      updateGeometry(geometry1, joinedAudioData, state.clock.elapsedTime, 0.5);
      updateGeometry(geometry2, joinedAudioData, state.clock.elapsedTime, 0.2);
      updateGeometry(geometry3, joinedAudioData, state.clock.elapsedTime, 0.1);
      updateGeometry(geometry4, joinedAudioData, state.clock.elapsedTime, 0.05);
      updateGeometry(
        geometry5,
        joinedAudioData,
        state.clock.elapsedTime,
        0.025
      );
      updateGeometry(geometry6, joinedAudioData, state.clock.elapsedTime, 0.01);
      updateGeometry(
        geometry5,
        joinedAudioData,
        state.clock.elapsedTime,
        0.025
      );
      updateGeometry(geometry6, joinedAudioData, state.clock.elapsedTime, 0.01);

      if (sphere.current) {
        const currScale = sphere.current.scale.x;
        const newScale = map(
          lerp(currScale, modifiedData[0], 0.2),
          0,
          1,
          0,
          1,
          easeInOutQuint
        );
        sphere.current.scale.x = sphere.current.scale.y = sphere.current.scale.z = newScale;
      }

      if (phone.current) {
        const currScale2 = phone.current.scale.x;
        let newScale2 = map(
          lerp(currScale2, modifiedData[0], 0.3),
          0,
          1,
          0,
          1,
          easeInOutQuint
        );
        newScale2 = clamp(newScale2, 0.4, 0.8);
        phone.current.scale.x = phone.current.scale.y = phone.current.scale.z = newScale2;
      }
    }
  });

  const [largeMaterial, smallMaterial] = useMemo(() => {
    const factor = 2 / window.devicePixelRatio;
    return [
      <pointsMaterial
        args={{ size: 6 * factor, color: "black" }}
        attach="material"
      />,
      <pointsMaterial
        args={{ size: 2 * factor, color: "black" }}
        attach="material"
      />,
    ];
  }, []);

  return (
    <>
      <mesh ref={sphere} position={[0, 0, -2000]}>
        <sphereBufferGeometry attach="geometry" args={[75, 4, 20]} />
        <meshBasicMaterial attach="material" color={0xad0000} />
      </mesh>

      <mesh ref={phone} position={[0, 0, -1200]}>
        <planeBufferGeometry attach="geometry" args={[150, 150, 1, 1]} />
        <meshBasicMaterial
          attach="material"
          map={phoneTexture}
          alphaTest={0.5}
          transparent={true}
        />
      </mesh>

      <group position={[0, 0, -1000]} ref={group}>
        <points>
          {largeMaterial}
          <primitive object={geometry1} attach="geometry" />
        </points>
        <points>
          {smallMaterial}
          <primitive object={geometry2} attach="geometry" />
        </points>
        <points>
          {smallMaterial}
          <primitive object={geometry3} attach="geometry" />
        </points>
        <points>
          {smallMaterial}
          <primitive object={geometry4} attach="geometry" />
        </points>{" "}
        <points>
          {smallMaterial}
          <primitive object={geometry5} attach="geometry" />
        </points>{" "}
        <points>
          {smallMaterial}
          <primitive object={geometry6} attach="geometry" />
        </points>
      </group>
    </>
  );
};

export default Visualiser;
