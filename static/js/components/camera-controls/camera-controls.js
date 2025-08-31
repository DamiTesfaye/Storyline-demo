import { useStore } from "hooks/use-store";
import { map } from "math/map";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { animated, interpolate, useSpring } from "@react-spring/three";
import { useThree } from "react-three-fiber";
import { useDrag, useMove } from "react-use-gesture";
import issues from "services/issues";

// How far the camera has to travel until it requests that the UI is shown
const distanceThreshold = 2;

const CameraControls = observer((props) => {
  // The Z distances in the various states of the app
  const distances = {
    browsing: issues.MOBILE ? 6.1 : 5.5,
    activeVideo: issues.MOBILE ? 3.5 : 2.2,
    activeAudio: issues.MOBILE ? 1.9 : 2.2,
    dragging: issues.MOBILE ? 2.5 : 10,
    initial: -24,
  };
  const store = useStore();

  const ref = useRef();
  const { setDefaultCamera } = useThree();
  useLayoutEffect(() => setDefaultCamera(ref.current), [setDefaultCamera]);

  // Setup the springs - for movement, peeking, zooming and rotation
  const positionProxy = useRef({
    x: 0.33,
    y: 0.5,
  });
  const positionConfigs = {
    active: { precision: 0.0001, mass: 1, tension: 100, friction: 40 },
    browsing: { precision: 0.0001, mass: 1, tension: 200, friction: 40 },
  };
  const [position, setPosition] = useSpring(() => {
    return {
      ...positionProxy.current,
      config: positionConfigs.browsing,
    };
  });

  const [peek, setPeek] = useSpring(() => {
    return {
      x: 0.0,
      y: 0.0,
      config: { precision: 0.0001, mass: 1, tension: 400, friction: 50 },
    };
  });

  const [peekStrength, setPeekStrength] = useSpring(() => {
    return {
      strength: 0,
      config: { precision: 0.0001, mass: 1, tension: 10, friction: 10 },
    };
  });

  const [z, setZ] = useSpring(() => {
    return {
      z: distances.initial,
      config: { precision: 0.0001, mass: 1, tension: 300, friction: 120 },
    };
  });

  const [rotation, setRotation] = useSpring(() => {
    return {
      z: Math.PI * -0.15,
      config: { precision: 0.001, mass: 1, tension: 20, friction: 20 },
    };
  });

  const bindDrag = useDrag(
    (state) => {
      /* console.log(position.x.value, store.cameraBounds.min.x); */
      if (store.isDragging !== state.dragging)
        store.setIsDragging(state.dragging);
      if (!store.activeId && state.dragging) {
        if (!store.hasDragged) store.setHasDragged(true);
        const scale = 15;
        const { delta } = state;

        const normalisedDelta = normaliseCoords({
          x: delta[0],
          y: delta[1],
        });

        positionProxy.current.x += normalisedDelta.x * -scale;
        positionProxy.current.y += normalisedDelta.y * scale;

        const cameraBounds = store.cameraBounds;

        // Keep camera in bounds
        const boundsPad = {
          top: 0,
          bottom: 9,
          left: 9,
          right: 9,
        };
        // Left
        if (positionProxy.current.x < cameraBounds.min.x - boundsPad.left) {
          positionProxy.current.x = cameraBounds.min.x - boundsPad.left;
        }
        // Right
        if (positionProxy.current.x > cameraBounds.max.x + boundsPad.right) {
          positionProxy.current.x = cameraBounds.max.x + boundsPad.right;
        }
        // Top
        if (positionProxy.current.y > cameraBounds.max.y + boundsPad.top) {
          positionProxy.current.y = cameraBounds.max.y + boundsPad.top;
        }
        // Bottom
        if (positionProxy.current.y < cameraBounds.min.y - boundsPad.bottom) {
          positionProxy.current.y = cameraBounds.min.y - boundsPad.bottom;
        }

        // If camera moves outside this area, show home cursor
        const backHomePad = {
          top: -4,
          bottom: 4,
          left: 3,
          right: 3,
        };

        if (
          positionProxy.current.x < cameraBounds.min.x - backHomePad.left ||
          positionProxy.current.x > cameraBounds.max.x + backHomePad.right ||
          positionProxy.current.y > cameraBounds.max.y + backHomePad.top ||
          positionProxy.current.y < cameraBounds.min.y - backHomePad.bottom
        ) {
          if (!store.showHomeCursor) store.setShowHomeCursor(true);
        } else {
          if (store.showHomeCursor) store.setShowHomeCursor(false);
        }

        const coords = {
          x: positionProxy.current.x,
          y: positionProxy.current.y,
        };

        setPosition({
          ...coords,
          config: positionConfigs.browsing,
          reset: false,
        });
        setZ({
          z: map(state.velocity, 0, 3, distances.browsing, distances.dragging),
        });
      } else if (store.activeId) {
        /*         setZ({
          z:
            store.activeItemType === "audio"
              ? distances.activeAudio
              : distances.activeVideo,
        }); */
      } else if (!state.dragging) {
        setZ({
          z: distances.browsing,
        });
      }
      const distanceFromOrigin = Math.sqrt(
        Math.pow(position.x.value, 2) + Math.pow(position.y.value, 2)
      );
      if (distanceFromOrigin > distanceThreshold) {
        if (!store.showUI) store.setShowUI(true);
      } else {
        if (store.showUI) store.setShowUI(false);
      }
    },
    { domTarget: document.body, filterTaps: true }
  );

  // When the user moves the pointer, 'peek' around
  const bindMove = useMove(
    (state) => {
      if (!state.dragging && /* !store.activeId */ /*  && */ store.appReady) {
        const { xy } = state;
        const coords = normaliseCoords({ x: xy[0], y: xy[1] }, true);
        coords.x *= 0.5;
        coords.y *= -0.5;
        setPeek(coords);
      }
    },
    { domTarget: window, filterTaps: true }
  );

  // Establish pointer bindings
  useEffect(() => {
    bindDrag();
    if (!issues.MOBILE) bindMove();
  }, [bindDrag, bindMove]);

  // When the app has loaded run a small intro
  useEffect(() => {
    if (store.appReady === true) {
      let z = 0;
      if (store.activeId) {
        z =
          store.activeItemType === "video"
            ? distances.activeVideo
            : distances.activeAudio;
      } else {
        z = distances.browsing;
      }

      setTimeout(() => {
        setPosition({ ...store.activePosition, reset: true });
        setRotation({ z: 0 });
        setZ({
          z,
        });
      }, 600);
    }
  }, [store.appReady]);

  // When there is an active id, ie. in a story, dont enable 'peeking'
  useEffect(() => {
    if (store.activeId) {
      setPeekStrength({ strength: 0.15 });
    } else {
      setPeekStrength({ strength: 1 });
    }
  }, [store.activeId]);

  // When there is an active id, pan/zoom the camera to that item's position
  useEffect(() => {
    // const pos = { x: position.x.value, y: position.y.value };
    if (store.activeId) {
      positionProxy.current = { ...store.activePosition };
      setTimeout(() => {
        setPosition({
          ...store.activePosition,
          config: positionConfigs.active,
          reset: false,
        });

        setZ({
          z:
            store.activeItemType === "audio"
              ? distances.activeAudio
              : distances.activeVideo,
          delay: 0,
          config: { mass: 1, tension: 40, friction: 30 },
        });
      }, 1);
    } else if (store.appReady) {
      setZ({
        z: distances.browsing,
        config: { mass: 1, tension: 300, friction: 120 },
      });
    }
  }, [store.activeId, store.activePosition]);

  // When the user requests to go home
  useEffect(() => {
    if (store.requestHome) {
      positionProxy.current = { x: 0.33, y: 0.5 };
      setPosition(positionProxy.current);
      store.setRequestHome(false);
      store.setShowHomeCursor(false);
      if (store.showUI) store.setShowUI(false);
    }
  }, [store.requestHome]);

  // Helper function that converts mouse coords to normalised screen coords
  const normaliseCoords = useCallback(
    ({ x, y }, centered) => {
      const result = {
        x: x / document.body.clientWidth,
        y: y / document.body.clientHeight,
      };
      if (centered) {
        result.x = map(result.x, 0, 1, -1, 1);
        result.y = map(result.y, 0, 1, -1, 1);
      }
      return result;
    },
    [document.body.clientWidth, document.body.clientHeight]
  );

  return (
    <animated.perspectiveCamera
      ref={ref}
      /*    rotation-x={-0.2} */
      /*    rotation-y={-0.2} */
      position-x={interpolate(
        [position.x, peek.x, peekStrength.strength],
        (positionX, peekX, peekStrength) => positionX + peekX * peekStrength
      )}
      position-y={interpolate(
        [position.y, peek.y, peekStrength.strength],
        (positionY, peekY, peekStrength) => positionY + peekY * peekStrength
      )}
      position-z={z.z}
      rotation-z={rotation.z}
    />
  );
});

export default CameraControls;
