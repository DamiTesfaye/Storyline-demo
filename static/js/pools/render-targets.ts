import * as THREE from "three";

type RenderTarget = THREE.WebGLRenderTarget;

const pool: {
  available: RenderTarget[];
  allocate: (
    width: number,
    height: number,
    args?: THREE.WebGLRenderTargetOptions
  ) => RenderTarget;
  release: (target: RenderTarget) => void;
} = {
  available: [],
  allocate: (width, height, args) => {
    let target: RenderTarget;
    if (pool.available.length <= 0) {
      target = new THREE.WebGLRenderTarget(width, height, args);
    } else {
      target = pool.available.pop() as RenderTarget;
      if (target.width !== width || target.height !== height)
        target.setSize(width, height);
    }
    return target;
  },
  release: (target) => {
    const index = pool.available.indexOf(target);
    if (index === -1) {
      pool.available.push(target);
    } else {
      console.warn("wot");
    }
  },
};

// Pre allocate 10
/* const allocated = new Array(10).fill().map(() => pool.allocate(512, 1024));
allocated.forEach((target) => {
  pool.release(target);
}); */

export default pool;
