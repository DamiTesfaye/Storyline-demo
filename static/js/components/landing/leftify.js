const leftify = (geom) => {
  if (geom.userData.leftified === true) return;
  geom.computeBoundingBox();
  const width = Math.abs(geom.boundingBox.max.x - geom.boundingBox.min.x);
  geom.translate(width * 0.5, 0 /* height * -0.5 */, 0);
  geom.userData.leftified = true;
};

export default leftify;
