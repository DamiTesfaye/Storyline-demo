//import { Uniform, Vector3 } from "three";
import { Effect } from "postprocessing";
import * as THREE from "three";
// import fragmentShader from "./shader.frag";
import fragmentShader from './shader.frag?raw';

export class BarrelEffect extends Effect {
  constructor(params) {
    const defines = new Map();
    if (params.useEdgeDither) {
      defines.set("USE_EDGE_DITHER", "1");
    }
    super("BarrelEffect", fragmentShader, {
      defines,
      uniforms: new Map([["strength", new THREE.Uniform(params.strength)]]),
    });
  }

  set strength(v) {
    const uniform = this.uniforms.get("strength");
    uniform.value = v;
  }

  get strength() {
    return this.uniforms.get("strength").value;
  }
}
