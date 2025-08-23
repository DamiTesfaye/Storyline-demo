import { throttle } from "lodash";
import { useCallback } from "react";
import * as THREE from "three";

const checkIsOnScreen = (camera, object3d) => {
  if (!object3d) return false;
  const worldPosition = new THREE.Vector3();
  object3d.localToWorld(worldPosition);
  const worldPosition2D = new THREE.Vector2(worldPosition.x, worldPosition.y);
  // HACK - figure out how to not run this check until the first render
  if (worldPosition2D.x + worldPosition2D.y === 0) return false;
  const camera2D = new THREE.Vector2(camera.position.x, camera.position.y);
  const diff2D = camera2D.sub(worldPosition2D);
  diff2D.x = Math.abs(diff2D.x);
  diff2D.y = Math.abs(diff2D.y);
  const isOnScreen = diff2D.x < 6 && diff2D.y < 3;
  const shouldLoad = diff2D.x < 9 && diff2D.y < 6;
  const shouldAnimate = diff2D.x < 2.5 && diff2D.y < 2;
  return { isOnScreen, shouldLoad, shouldAnimate };
};

const useCheckIsOnScreen = (throttleRate = 250) => {
  const checkIsOnScreenThrottled = useCallback(
    throttle((cam, object3d) => {
      return checkIsOnScreen(cam, object3d);
    }, throttleRate + Math.random() * 150),
    []
  );
  return checkIsOnScreenThrottled;
};

export default useCheckIsOnScreen;
