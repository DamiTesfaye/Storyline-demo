import * as THREE from "three";

export default {
  attach: "material",
  transparent: true,
  //alphaTest: 0.5,
  flatShading: true,
  depthWrite: true,
  depthTest: true,
  side: THREE.FrontSide,
};
