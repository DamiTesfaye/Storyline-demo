import * as THREE from "three";

const pool = {};
pool.available = [];

pool.allocate = (width, height, args) => {
  let target;
  if (pool.available.length <= 0) {
    target = new THREE.WebGLRenderTarget(width, height, args);
  } else {
    target = pool.available.pop();
    if (target.width !== width || target.height !== height)
      target.setSize(width, height);
  }
  return target;
};

pool.release = (target) => {
  var index = pool.available.indexOf(target);
  //console.log(pool.available.length);
  if (index === -1) {
    pool.available.push(target);
  } else {
    console.warn("wot");
  }
};

// Pre allocate 10
/* const allocated = new Array(10).fill().map(() => pool.allocate(512, 1024));
allocated.forEach((target) => {
  pool.release(target);
}); */

export default pool;
