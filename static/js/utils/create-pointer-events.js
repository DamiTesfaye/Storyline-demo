// The built in onClick in react-three-fiber will trigger if the user
// mouses down, travels their pointer, and then release back over the same object
// which in this particular situation feels incredibly unintuitive.
// The function below will measure how far a user has moved their cursor and if
// above a certain threshold, wont trigger a mouse up event
const createPointerEvents = (f) => {
  let isDown = false;
  let downScreenPosition = { x: 0, y: 0 };
  const onPointerUp = (e) => {
    const currScreenPosition = { x: e.screenX, y: e.screenY };
    const diffScreenPosition = {
      x: currScreenPosition.x - downScreenPosition.x,
      y: currScreenPosition.y - downScreenPosition.y,
    };
    const screenTravel = Math.sqrt(
      diffScreenPosition.x * diffScreenPosition.x +
        diffScreenPosition.y +
        diffScreenPosition.y
    );
    if (isDown && screenTravel < 6) {
      e.stopPropagation();
      isDown = false;
      f();
    }
  };
  const onPointerDown = (e) => {
    downScreenPosition = { x: e.screenX, y: e.screenY };
    isDown = true;
  };
  return { onPointerUp, onPointerDown };
};

export default createPointerEvents;
