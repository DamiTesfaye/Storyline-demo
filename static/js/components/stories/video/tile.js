import useWhyDidYouUpdate from "hooks/use-why-did-you-update";
import { isEqual } from "lodash";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import Fillets from "./fillets";
import Player from "./player";
import Thumbnail from "./thumbnail";

const Tile = (props) => {
  //useWhyDidYouUpdate("Tile", props);

  const dimensions = useMemo(() => {
    return props.isMain ? [2, 2] : [1, 1];
  }, [props.isMain]);
  const [initiatedLoad, setInitiateLoad] = useState(false);

  useEffect(() => {
    if (!initiatedLoad && props.load) {
      setInitiateLoad(true);
    }
  }, [props.load]);

  const getFilletSides = () => {
    const x = props.position[0];
    const y = props.position[1];
    // If we're on the top or bottom, or the main we need fillets on both sides
    if (Math.abs(y) > 1 || props.isMain) {
      return "both";
    }
    if (x < 0) return "left";
    return "right";
  };

  return (
    <group position={props.position}>
      {props.isMain && props.isActive ? (
        <Player
          position={props.position}
          isActive={props.isActive}
          isMain={props.isMain}
          video={props.video}
          dimensions={dimensions}
        />
      ) : null}

      {initiatedLoad ? (
        <Thumbnail
          id={props.id}
          animate={props.animate}
          index={props.index}
          thumbOrder={props.thumbOrder}
          isMain={props.isMain}
          isOver={props.isOver}
          isOnScreen={props.isOnScreen}
          dimensions={dimensions}
        />
      ) : null}

      <Suspense fallback={null}>
        <Fillets
          side={getFilletSides()}
          isMain={props.isMain}
          dimensions={dimensions}
        />
      </Suspense>
    </group>
  );
};

/* export default Tile; */

export default React.memo(Tile, (before, after) => {
  const position = isEqual(before.position, after.position);
  const animate = before.animate == after.animate;
  const load = before.load == after.load;
  const isActive = before.isActive == after.isActive;
  const isOver = before.isOver == after.isOver;
  const isOnScreen = before.isOnScreen == after.isOnScreen;
  return position && animate && load && isActive && isOver && isOnScreen;
});
