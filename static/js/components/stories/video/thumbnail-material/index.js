import { easeOutQuint as easing } from "math/map";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { animated, useSpring, config } from "@react-spring/three";
import * as THREE from "three";
import fragmentShader from "./shader.frag?raw";
// import vertexShader from "./shader.vert";
import vertexShader from "./shader.vert?raw";
import { useFrame } from "react-three-fiber";

const ThumbnailMaterial = React.forwardRef((props, ref) => {
  //console.log(props.offsetX);

  const [uniforms, setUniforms] = useSpring((v) => {
    return {
      brightness: 0.1,
      contrast: 0.3,
      inverse: 1,
      saturation: 0.1,
      scale: 0.93,
      config: {
        duration: 200,
        easing,
      },
    };
  });

  const [whiteOverlay, setWhiteOverlay] = useSpring((v) => {
    return {
      whiteOverlay: 1,
      config: {
        duration: 1000,
        easing,
      },
    };
  });

  const [rollover, setRollover] = useSpring((v) => {
    return {
      scale: 0.93,
      rolloverStrength: 0,
      config: config.slow,
    };
  });

  useLayoutEffect(() => {
    switch (props.animate) {
      case "in-initial":
        setWhiteOverlay({
          whiteOverlay: 0,
          delay: props.index * 200,
        });
      // No break! We want this to also animate in
      case "in":
        setUniforms({
          brightness: 0.0,
          contrast: 1,
          inverse: 0,
          saturation: 1,
          config: {
            duration: 1500 + Math.random() * 2000,
          },
          delay: props.index * 100,
        });
        break;
      case "out":
        setUniforms({
          brightness: 0.1,
          contrast: 0.3,
          inverse: 1,
          saturation: 0.1,
          config: { duration: 500 },
          delay: 2000,
        });
        break;

      case "rollover":
        /*         setWhiteOverlay({
          reset: true,
          from: { whiteOverlay: 1 },
          whiteOverlay: 0,
          config: { duration: 500 + Math.random() * 500 },
        }); */
        setRollover({
          scale: 0.85,
          rolloverStrength: 1,
          delay: 0,
        });
        break;

      case "rollout":
        setRollover({
          scale: 0.93,
          rolloverStrength: 0,
          delay: 0,
        });
        break;
    }
  }, [props.animate]);

  const shaderMaterial = useMemo(() => {
    if (props.map && props.alphaMap) {
      const args = {
        uniforms: {
          type: "ThumbnailMaterial",
          uBrightness: { type: "f", value: 0 },
          uContrast: { type: "f", value: 1 },
          uInverse: { type: "f", value: 0 },
          uSaturation: { type: "f", value: 1 },
          tDiffuse: { type: "t", value: props.map },
          tAlpha: { type: "t", value: props.alphaMap },
          uOffset: { type: "v2", value: new THREE.Vector2(0, 0) },
          uWhiteOverlay: { type: "f", value: 1 },
          uScale: { type: "f", value: 0.93 },
          uTime: { type: "f", value: 0 },
          uTimeOffset: { type: "f", value: Math.random() * 10 },
          uRolloverStrength: { type: "f", value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: false,
        depthTest: false,
        depthWrite: true,
      };
      const m = new THREE.ShaderMaterial(args);
      return m;
    }
  }, [props.map, props.alphaMap]);

  // const { clock } = useThree();
  useFrame((state) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (() => {
    return shaderMaterial ? (
        <animated.primitive
            ref={ref}
            attach="material"
            object={shaderMaterial}
            uniforms-uBrightness-value={uniforms.brightness}
            uniforms-uContrast-value={uniforms.contrast}
            uniforms-uInverse-value={uniforms.inverse}
            uniforms-uSaturation-value={uniforms.saturation}
            uniforms-uScale-value={rollover.scale}
            uniforms-uRolloverStrength-value={rollover.rolloverStrength}
            uniforms-uWhiteOverlay-value={whiteOverlay.whiteOverlay}
        />
    ) : null;
  })();

  // if (!shaderMaterial) {
  //   return null;
  // }
  //
  // return (
  //   <animated.primitive
  //     ref={ref}
  //     attach="material"
  //     object={shaderMaterial}
  //     uniforms-uBrightness-value={uniforms.brightness}
  //     uniforms-uContrast-value={uniforms.contrast}
  //     uniforms-uInverse-value={uniforms.inverse}
  //     uniforms-uSaturation-value={uniforms.saturation}
  //     uniforms-uScale-value={rollover.scale}
  //     uniforms-uRolloverStrength-value={rollover.rolloverStrength}
  //     uniforms-uWhiteOverlay-value={whiteOverlay.whiteOverlay}
  //   />
  // );
});

export default ThumbnailMaterial;
