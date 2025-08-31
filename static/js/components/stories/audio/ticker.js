import font from "assets/fonts/neue-machina/neue-machina-light.woff";
import {
  default as React,
  useEffect,
  useRef,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { preloadFont, TextMesh } from "troika-3d-text";
import useWhyDidYouUpdate from "hooks/use-why-did-you-update";

// A shared material - troika derives a new material anyway... so having one
// 'base' material performs a lot better than creating a whole bunch of new
// shader programs per label
const material = new THREE.MeshBasicMaterial({
  depthTest: false,
  depthWrite: false,
  side: THREE.FrontSide,
  flatShading: true,
  /*  transparent: true, */
});

preloadFont(
  font,
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'\".,!?&$@…’:",
  () => {}
);

const Ticker = (props) => {
  useWhyDidYouUpdate("Ticker", props);
  const group = useRef();
  //const currentTime = useRef(0);
  const [state, setState] = useState({});

  const text =
    props.text.length > 200 ? props.text.substring(0, 200) : props.text;
  const numText = text.length > 30 ? 3 : 6;
  const pad = 100;

  // Manually create the text. Note that I tried using drei React components, however
  // these were really hard to layout, as the bounds of the geometry isnt evaulated
  // until mesh.sync is called...
  const meshes = useMemo(() => {
    /*  if (!group.current) return; */
    /*     let syncCount = 0; */
    //const fontSize = 36 * (Math.random() > 0.5 ? 1 : 0.5);
    const meshes = new Array(numText).fill(null).map(() => {
      let text = props.text;
      const mesh = new TextMesh(material);
      mesh.color = 0x000000;
      mesh.fontSize = props.fontSize;
      mesh.lineHeight = 50;
      mesh.maxWidth = Number.MAX_VALUE;
      mesh.textAlign = "center";
      mesh.text = text;
      mesh.font = font;
      mesh.anchorX = "center";
      mesh.anchorY = "middle";
      return mesh;
    });
    return meshes;
  }, []);

  useLayoutEffect(() => {
    if (state.synced) return;
    let syncCount = 0;
    meshes.forEach((mesh) => {
      mesh.sync(() => {
        syncCount++;
        if (syncCount === numText) {
          setState({
            itemWidth: mesh.geometry.boundingSphere.radius * 2,
            tickerWidth: mesh.geometry.boundingSphere.radius * 2 * numText,
            synced: true,
          });
        }
      });
    });
    return () => {
      meshes.forEach((mesh) => {
        mesh.dispose();
      });
      // console.log("wot1");
    };
  }, [meshes]);

  // Once the text is created and synced... do the initial layout
  useLayoutEffect(() => {
    if (state.synced === true) {
      let nextX = 0;
      meshes.forEach((mesh, i) => {
        mesh.userData.i = i;
        mesh.position.x = nextX;
        if (nextX === 0 || i % 2 === 0) {
          nextX = Math.abs(nextX) + state.itemWidth + pad;
        } else {
          nextX *= -1;
        }
      });
      group.current.add(...meshes);
    }

    return () => {
      //console.log("wot2");
    };
  }, [state]);

  useFrame((frameState, delta) => {
    if (props.running && state.synced) {
      const direction = props.direction;
      const scroll = props.direction * delta * 70;
      const { itemWidth, tickerWidth } = state;

      // Sort the meshes based on x position, and direction of the ticker
      const sorted = meshes.sort((a, b) => {
        if (direction === 1) return a.position.x < b.position.x ? 1 : -1;
        if (direction === -1) return a.position.x > b.position.x ? 1 : -1;
      });

      // The 'lead' is the mesh that all other meshes follow.
      let lead = sorted[0];
      let tail = sorted[sorted.length - 1];
      lead.position.x += scroll;
      sorted.forEach((child, i) => {
        if (child != lead) {
          child.position.x =
            lead.position.x + (i * itemWidth + pad * i) * direction * -1;
        }
      });

      // Keep everything in bounds. If the lead move outside of bounds, then
      // in moves behind the tail position
      if (lead.position.x > tickerWidth * 0.5) {
        lead.position.x = tail.position.x - itemWidth - pad;
      }
      if (lead.position.x < -tickerWidth * 0.5) {
        lead.position.x = tail.position.x + itemWidth + pad;
      }
    }
  });

  return <group position={[0, 0, -10]} ref={group}></group>;
};

//export default Ticker;

export default React.memo(Ticker, (before, after) => {
  const running = before.running === after.running;
  const direction = before.direction === after.direction;
  const text = before.text === after.text;
  return running && direction & text;
});
