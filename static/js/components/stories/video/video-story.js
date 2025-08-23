import Chance from "chance";
import Subtitles from "components/subtitles";
import { HTML } from "drei";
import useCheckIsOnScreen from "hooks/use-check-is-on-screen";
import useMedia from "hooks/use-media";
import { useStore } from "hooks/use-store";
import useStoreMediaProgress from "hooks/use-store-media-progress";
import useWhyDidYouUpdate from "hooks/use-why-did-you-update";
import { isEqual } from "lodash";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFrame, useThree } from "react-three-fiber";
import createPointerEvents from "utils/create-pointer-events";
import Tile from "./tile";
import issues from "services/issues";
import FixedHTML from "components/fixed-html";

const VideoStory = (props) => {
  useWhyDidYouUpdate("VideoStory", props);

  const history = useHistory();
  const store = useStore();
  const [chance] = useState(new Chance(props.id));

  const [screenResults, setScreenResults] = useState({
    isOnScreen: false,
    shouldLoad: false,
    shouldAnimate: false,
  });

  const [isOver, setIsOver] = useState(false);
  const ui = useRef(document.getElementById("ui"));

  // Each cluster is made up of between 3 and 5 tiles
  const [numTiles] = useState(chance.integer({ min: 3, max: 5 }));

  const [video, play, pause, seek, unmute] = useMedia(props.id, "video");

  useStoreMediaProgress(video, store);

  // Create a random set of positions for the tiles
  const positions = useMemo(() => {
    let positions;

    let topBottomPositions = [
      { x: -0.5, y: 1.5 },
      { x: 0.5, y: 1.5 },
      { x: 0.5, y: -1.5 },
      { x: -0.5, y: -1.5 },
    ];

    let leftRightPositions = [
      { x: 1.5, y: 0.5 },
      { x: 1.5, y: -0.5 },
      { x: -1.5, y: -0.5 },
      { x: -1.5, y: 0.5 },
    ];

    if (issues.MOBILE) {
      // On mobile prioritise the top and bottom positions as the viewport
      // will most likely be a portrait orientation
      const shuffled = chance.shuffle(topBottomPositions);
      const mustHave = [...shuffled.slice(0, 3)];
      const niceToHave = [...shuffled.slice(3)];
      positions = [
        ...mustHave,
        ...chance.shuffle(leftRightPositions),
        ...niceToHave,
      ];
    } else {
      // On desktop the layout is more 'square' so pick any of the available
      // positions
      positions = chance.shuffle([
        ...topBottomPositions,
        ...leftRightPositions,
      ]);
    }

    // And add the center tile to the top of the list... cos we need that for sure :)
    positions.unshift({ x: 0, y: 0 });

    return positions;
  }, []);

  useEffect(() => {
    if (props.isActive) {
      //seek(0);
      play();
    } else {
      pause();
    }
  }, [props.isActive]);

  const three = useThree();
  useEffect(() => {
    const el = three.gl.domElement;
    el.style.cursor = isOver ? "pointer" : "auto";
  }, [isOver]);

  const pointerEvents = useMemo(() => {
    const navigate = () => {
      if (history.location.pathname !== `/${props.id}`) {
        history.push(props.id);
        seek(0);
        play();
      }
    };
    return createPointerEvents(navigate);
  }, [history, props.id]);

  const setHover = (hoverState, id) => {
    store.setHover(hoverState, id);
  };

  const group = useRef();
  const checkIsOnScreen = useCheckIsOnScreen();
  const { camera } = useThree();

  useFrame(() => {
    const results = checkIsOnScreen(camera, group.current);
    setScreenResults(results);
  });

  const thumbOrder = useMemo(() => {
    const hero = props.hero || 1;
    let order = [1, 2, 3, 4, 5];
    order = order.filter((val) => val != hero);
    order.unshift(hero);
    return order;
  }, []);

  /*  console.log(document.getElementById("ui"));
   */
  return (
    <group
      ref={group}
      position={props.position}
      onPointerUp={pointerEvents.onPointerUp}
      onPointerDown={pointerEvents.onPointerDown}
      onPointerOver={() => {
        setIsOver(true);
      }}
      onPointerMove={() => {
        setHover(true, props.id);
      }}
      onPointerOut={() => {
        setHover(false, null);
        setIsOver(false);
      }}
    >
      {new Array(numTiles).fill().map((val, i) => {
        const isMain = i === 0;
        return (
          <Tile
            {...props}
            video={isMain ? video : null}
            thumbOrder={thumbOrder}
            key={i}
            index={i}
            isMain={isMain}
            isActive={props.isActive}
            position={[positions[i].x, positions[i].y, 0]}
            isOnScreen={screenResults.isOnScreen}
            animate={screenResults.shouldAnimate ? "in" : "out"}
            isOver={isOver}
            load={screenResults.shouldLoad}
          ></Tile>
        );
      })}

      {props.isActive && props.subtitles ? (
        window.innerWidth <= 768 ? (
          <FixedHTML
            zIndexRange={[100, 0]}
            portal={ui}
            styles={{
              position: "absolute",
              top: "0",
              width: "100%",
              height: "100%",
              zIndex: "100",
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: issues.MOBILE ? "flex-end" : "center",
            }}
          >
            <Subtitles video={video} vttURL={`videos/${props.id}.vtt`} />
          </FixedHTML>
        ) : (
          <HTML
            position={[0, 0, 0.7]}
            zIndexRange={[100, 0]}
            portal={ui}
            center={true}
          >
            <Subtitles video={video} vttURL={`videos/${props.id}.vtt`} />
          </HTML>
        )
      ) : null}
    </group>
  );
};

export default React.memo(VideoStory, (before, after) => {
  // console.log(before, after);
  const isActive = before.isActive === after.isActive;
  const position = isEqual(before.position, after.position);
  return isActive && position;
});
