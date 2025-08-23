import { OrthographicCamera } from "drei";
import renderTargetPool from "pools/render-targets";
import React, {
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal, useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";
import { ceilPOT } from "math";
import { throttle } from "lodash";

const SceneOnMesh = (props) => {
  const {
    material,
    unitToTextureSize,
    planeDimensions,
    rendering,
    clearColor,
    textureScaleFactor = 1,
  } = props;

  const renderTargetCamera = useRef();
  const mesh = useRef();

  const scene = useMemo(() => {
    const scene = new THREE.Scene({ background: "white" });
    return scene;
  }, []);

  const targetRef = useRef();
  const target = useMemo(() => {
    if (rendering && !targetRef.current) {
      const target = renderTargetPool.allocate(
        ceilPOT(unitToTextureSize[0] * planeDimensions[0]),
        ceilPOT(unitToTextureSize[1] * planeDimensions[1]),
        {
          wrapS: THREE.MirroredRepeatWrapping,
          wrapT: THREE.MirroredRepeatWrapping,
          depthBuffer: false,
          stencilBuffer: false,
        }
      );
      targetRef.current = target;
      return target;
    } else if (targetRef.current) {
      renderTargetPool.release(targetRef.current);
      targetRef.current = null;
      return null;
    }
  }, [rendering, planeDimensions[0], planeDimensions[1]]);

  useEffect(() => {
    return () => {
      if (targetRef.current) {
        renderTargetPool.release(targetRef.current);
        targetRef.current = null;
      }
    };
  }, [target]);

  // The camera doesnt update its matrix if frutrum paramaters are applied as
  // args, so do it as a sideEffect... but on the plus side, when the window
  // size changes we can recalculate the frustrum too
  useLayoutEffect(() => {
    const currentRenderTargetCamera = renderTargetCamera.current;
    if (currentRenderTargetCamera) {
      currentRenderTargetCamera.left =
        props.planeDimensions[0] *
        -0.5 *
        props.unitToTextureSize[0] *
        textureScaleFactor;
      currentRenderTargetCamera.right =
        props.planeDimensions[0] *
        0.5 *
        props.unitToTextureSize[0] *
        textureScaleFactor;
      currentRenderTargetCamera.top =
        props.planeDimensions[1] *
        0.5 *
        props.unitToTextureSize[1] *
        textureScaleFactor;
      currentRenderTargetCamera.bottom =
        props.planeDimensions[1] *
        -0.5 *
        props.unitToTextureSize[1] *
        textureScaleFactor;
      currentRenderTargetCamera.updateProjectionMatrix();
    }
  }, [window.innerWidth, window.innerHeight]);

  const wrappedMaterial = useMemo(() => {
    return React.cloneElement(material, {
      map: target ? target.texture : null,
    });
    /* return <meshBasicMaterial args={{ color: 0xff0000 }} />; */
  }, [material, target]);

  // Render the offscreen target. Note, this only renders
  // when group.current is visible on screen, which saves a load of GPU
  // compute time
  const count = useRef(0);

  const render = useCallback(
    throttle((state) => {
      count.current++;
      if (rendering) {
        //console.log(count.current);
        //  if (count.current === 10) return;
        const currentRenderTargetCamera = renderTargetCamera.current;
        if (currentRenderTargetCamera && target) {
          const prevColor = state.gl.getClearColor();
          const prevAlpha = state.gl.getClearAlpha();
          state.gl.setRenderTarget(target);
          if (clearColor && clearColor != prevColor)
            state.gl.setClearColor(clearColor, 1);
          state.gl.clear();
          state.gl.render(scene, currentRenderTargetCamera);
          state.gl.setRenderTarget(null);
          state.gl.setClearColor(prevColor, prevAlpha);
        }
        // HACK: get around the first render being a empty black texture
        if (mesh.current) mesh.current.visible = true;
      }
    }, 1000 / props.framerate),
    [props.framerate]
  );

  useFrame((state) => {
    render(state);
  });

  return (
    <>
      <OrthographicCamera ref={renderTargetCamera} position={[0, 0, 1]} />
      {createPortal(props.children || <></>, scene)}
      <mesh visible={false} ref={mesh} scale={props.scale || [1, 1, 1]}>
        <planeBufferGeometry attach="geometry" args={planeDimensions} />
        {wrappedMaterial}
      </mesh>
    </>
  );
};

export default SceneOnMesh;
