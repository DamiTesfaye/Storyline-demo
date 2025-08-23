import React from "react";
import * as THREE from "three";
import materialDefaults from "../material-defaults";
import FilletCenter from "./fillet-center";
import FilletCorner from "./fillet-corner";
import useWhyDidYouUpdate from "hooks/use-why-did-you-update";
import { isEqual } from "lodash";

const Fillets = (props) => {
  useWhyDidYouUpdate("Fillets", props);

  const { dimensions } = props;

  const getCornerPosition = (position) => {
    let x = 0;
    let y = 0;
    if (position[0] === "t") y = dimensions[1] * 0.5; // top
    if (position[0] === "c") y = 0; // center
    if (position[0] === "b") y = dimensions[1] * -0.5; // bottom
    if (position[1] === "l") x = dimensions[0] * -0.5; // left
    if (position[1] === "r") x = dimensions[0] * 0.5; // right
    return new THREE.Vector3(x, y, 0);
  };

  return (
    <group renderOrder={2}>
      {(() => {
        if (props.side === "left" || props.side === "both") {
          return (
            <>
              <FilletCorner
                orientation={"tl"}
                position={getCornerPosition("tl")}
              />
              <FilletCorner
                orientation={"bl"}
                position={getCornerPosition("bl")}
              />
            </>
          );
        }
      })()}

      {(() => {
        if (props.side === "right" || props.side === "both") {
          return (
            <>
              <FilletCorner
                orientation={"tr"}
                position={getCornerPosition("tr")}
              />
              <FilletCorner
                orientation={"br"}
                position={getCornerPosition("br")}
              />
            </>
          );
        }
      })()}

      {(() => {
        if (props.isMain) {
          return (
            <>
              <FilletCenter
                orientation={"cl"}
                position={getCornerPosition("cl")}
              />
              <FilletCenter
                orientation={"cr"}
                position={getCornerPosition("cr")}
              />
            </>
          );
        }
      })()}
    </group>
  );
};

//export default Fillets;

export default React.memo(Fillets, (before, after) => {
  return (
    isEqual(before.dimensions, after.dimensions) &&
    before.isMain == after.isMain
  );
});
