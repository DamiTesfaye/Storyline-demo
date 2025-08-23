import useFont from "hooks/use-troika-font";
import { TextMesh } from "troika-3d-text";
import React, { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

import usePromise from "react-promise-suspense";

// A shared material - troika derives a new material anyway... so having one
// 'base' material performs a lot better than creating a whole bunch of new
// shader programs per label
const material = new THREE.MeshBasicMaterial({
  depthTest: false,
  depthWrite: false,
  side: THREE.FrontSide,
  flatShading: true,
});

const Label = (props) => {
  const group = useRef();
  const primitive = useRef();
  // console.log(props.children);

  useFont(props.font);

  const mesh = useMemo(() => {
    const m = new TextMesh(material);
    const {
      color,
      fontSize = 1,
      lineHeight = 1,
      textAlign = "left",
      font = "Arial",
      anchorX = 0,
      anchorY = 0,
      maxWidth = 5,
    } = props;
    m.color = color;
    m.fontSize = fontSize;
    m.lineHeight = lineHeight;
    m.maxWidth = maxWidth;
    m.textAlign = textAlign;
    m.font = font;
    m.anchorX = anchorX;
    m.anchorY = anchorY;
    m.text = props.children.toString().replace(/\\n/g, "\n");
    return m;
  });

  useEffect(() => {
    mesh.sync();
  }, []);

  /*   const syncMesh = () => {
    return new Promise((resolve, reject) => {
      mesh.sync(() => {
        console.log("im done         ", props.children);
        resolve(mesh);
      });
    });
  };
  usePromise(syncMesh, [mesh]); */

  return (
    <group ref={group} position={props.position} renderOrder={0}>
      <primitive ref={primitive} object={mesh} />
    </group>
  );
};

export default Label;
