import React, { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
// import fragmentShader from "./shader.frag";
import fragmentShader from "./shader.frag?raw";
// import vertexShader from "./shader.vert";
import vertexShader from "./shader.vert?raw";
import { useThree } from "react-three-fiber";
import { useSpring, animated } from "react-spring/three";
import { easeOutQuint as easing, easeOutCubic, easeInCubic } from "math/map";

const AudioStoryMaterial = (props) => {
  const [uniforms, setUniforms] = useSpring((v) => {
    return {
      distortion: 1,
      pixelation: 1,
      config: {
        duration: 2000,
        easing,
      },
    };
  });

  const [opacity, setOpacity] = useSpring((v) => {
    return {
      opacity: 0,
      config: {
        duration: 500,
        easing,
      },
    };
  });

  const [interlace, setInterlace] = useSpring((v) => {
    return {
      interlace: 1,
      config: {
        duration: 500,
        easing,
      },
    };
  });

  const timeOffset = useRef(Math.random() * 50);

  useEffect(() => {
    let delay;
    switch (props.animate) {
      case "in":
        delay = Math.random() * 500 + 500;
        setUniforms({
          distortion: 0,
          pixelation: 0,
          delay,
        });
        setOpacity({ opacity: 1, delay });
        break;
      case "in-intro":
        delay = 1200;
        setUniforms({
          distortion: 0,
          pixelation: 0,
          delay,
          config: { duration: 1500, easing: easeOutCubic },
        });
        setInterlace({
          from: { interlace: 50 },
          to: { interlace: 1 },
          delay,
          reset: true,
          ease: { easing: easeInCubic },
        });
        setOpacity({ opacity: 1, delay });
        break;
      case "out":
        setUniforms({ distortion: 1, pixelation: 1, opacity: 0 });
        setOpacity({ opacity: 0, delay: 1000 });
        break;
    }
  }, [props.animate]);

  const shaderMaterial = useMemo(() => {
    const defines = {};
    if (props.alphaTest) defines.alphaTest = true;

    const args = {
      type: "AudioStoryMaterial",
      defines,
      uniforms: {
        uTime: { value: 1.0 },
        uResolution: {
          value: props.map
            ? new THREE.Vector2(props.map.width, props.map.height)
            : new THREE.Vector2(),
        },
        uDistortionStrength: { value: 1 },
        uPixelationStrength: { value: 1 },
        uOpacityStrength: { value: 1 },
        uInterlaceStrength: { value: 1 },
        tDiffuse: { type: "t", value: props.map },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    };
    const m = new THREE.ShaderMaterial(args);
    return m;
  }, [props.map]);

  const { clock } = useThree();

  return (
    <animated.primitive
      attach="material"
      object={shaderMaterial}
      uniforms-uTime-value={clock.elapsedTime + timeOffset.current}
      uniforms-uDistortionStrength-value={uniforms.distortion}
      uniforms-uPixelationStrength-value={uniforms.pixelation}
      uniforms-uOpacityStrength-value={opacity.opacity}
      uniforms-uInterlaceStrength-value={interlace.interlace}
    />
  );
};

//export default AudioStoryMaterial;

export default React.memo(AudioStoryMaterial, (before, after) => {
  const map = before.map == after.map;
  const animate = before.animate == after.animate;
  return map && animate;
});
