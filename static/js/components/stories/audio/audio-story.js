import useCheckIsOnScreen from "hooks/use-check-is-on-screen";
import useMedia from "hooks/use-media";
import { useStore } from "hooks/use-store";
import useStoreMediaProgress from "hooks/use-store-media-progress";
import { isEqual } from "lodash";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { animated, useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import issues from "services/issues";
import * as THREE from "three";
import createPointerEvents from "utils/create-pointer-events";
import AudioStoryMaterial from "./audio-story-material";
import Border from "./border";
import SceneOnMesh from "./scene-on-mesh";
import Ticker from "./ticker";
import Visualiser from "./visualiser";

const AudioStory = (props) => {
  //useWhyDidYouUpdate("AudioStory", props);
  const { dimensions } = props;
  const { camera: globalCamera } = useThree();
  const group = useRef();
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const checkIsOnScreen = useCheckIsOnScreen();
  const history = useHistory();
  const store = useStore();
  const [audio, play, pause, seek, unmute] = useMedia(props.id, "audio");
  const [rollover, setRollover] = useSpring(() => {
    return {
      opacity: 0,
      config: { mass: 1, friction: 5, tension: 150 },
    };
  });

  useStoreMediaProgress(audio, store);

  useFrame(() => {
    const result = checkIsOnScreen(globalCamera, group.current);
    if (isOnScreen != result.isOnScreen) {
      setIsOnScreen(result.isOnScreen);
    }
  });

  useEffect(() => {
    if (props.isActive) {
      //seek(0);
      play();
    } else {
      pause();
    }
  }, [props.isActive]);

  const pointerEvents = useMemo(() => {
    const navigate = () => {
      if (history.location.pathname !== `/${props.id}`) {
        history.push(props.id);
        seek(0);
        play();
        store.setCameraHintId(props.cameraHintId);
      }
    };
    return createPointerEvents(navigate);
  }, [history, props.id]);

  const setHover = (hoverState, id) => {
    store.setHover(hoverState, id);
  };

  const three = useThree();
  useEffect(() => {
    const el = three.gl.domElement;
    el.style.cursor = isOver ? "pointer" : "auto";
  }, [isOver]);

  return (
    <>
      <group
        ref={group}
        onPointerUp={pointerEvents.onPointerUp}
        onPointerDown={pointerEvents.onPointerDown}
        onPointerOver={() => {
          setRollover({ opacity: 0.66 });
          setIsOver(true);
        }}
        onPointerMove={() => {
          setHover(true, props.id);
        }}
        onPointerOut={() => {
          setHover(false, null);
          setRollover({ opacity: 0 });
          setIsOver(false);
        }}
        position={props.position}
        position-z={-0.01}
      >
        {isOnScreen && props.isActive ? (
          <>
            <SceneOnMesh
              position={props.position}
              planeDimensions={dimensions}
              unitToTextureSize={[1024, 1024]}
              textureScaleFactor={0.5}
              rendering={isOnScreen}
              clearColor={0xffffff}
              material={
                <meshBasicMaterial
                  transparent={true}
                  blending={THREE.MultiplyBlending}
                  attach="material"
                />
              }
            >
              <Visualiser audio={audio} audioQuality={props.quality} />
            </SceneOnMesh>
          </>
        ) : null}

        {isOnScreen ? (
          <>
            <Suspense fallback={null}>
              <SceneOnMesh
                position={props.position}
                planeDimensions={dimensions}
                unitToTextureSize={(() => {
                  return issues.REQUIRES_LOW_RES_TEXTURES
                    ? [256, 128]
                    : [512, 256];
                })()}
                scale={[1, 0.5, 1]}
                rendering={isOnScreen}
                framerate={30}
                material={
                  <AudioStoryMaterial
                    animate={isOnScreen && !props.isActive ? "in" : "out"}
                    alphaTest={true}
                  />
                }
              >
                <Ticker
                  running={isOnScreen}
                  direction={props.direction}
                  text={props.tickerText}
                  fontSize={issues.REQUIRES_LOW_RES_TEXTURES ? 36 : 72}
                />
              </SceneOnMesh>

              <Border position={[dimensions[0] * -0.5, 0, 0]} />
              <Border position={[dimensions[0] * 0.5, 0, 0]} />

              <animated.mesh
                visible={rollover.opacity.interpolate((v) => v > 0)}
                position={[0, 0, -0.01]}
              >
                <animated.meshBasicMaterial
                  opacity={rollover.opacity}
                  transparent={true}
                  attach="material"
                  color={0xffffff}
                  depthTest={false}
                />
                <planeBufferGeometry
                  attach="geometry"
                  args={[...dimensions, 1, 1]}
                />
              </animated.mesh>
            </Suspense>
          </>
        ) : null}
      </group>
    </>
  );
};

export default React.memo(AudioStory, (before, after) => {
  const position = isEqual(before.position, after.position);
  const dimensions = isEqual(before.dimensions, after.dimensions);
  const isActive = isEqual(before.isActive, after.isActive);
  return position && dimensions && isActive;
});

//export default AudioStory;
