//import { Uniform, Vector3 } from "three";
import { Effect } from "postprocessing";
// import fragmentShader from "./shader.frag";
import * as THREE from "three";
import fragmentShader from "./shader.frag?raw";

export class ColorVignetteEffect extends Effect {
  constructor(params) {
    super("ColorVignetteEffect", fragmentShader, {
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
