import Background from "components/background";
import Landing from "components/landing";
import Lines from "components/lines";
import AudioStory from "components/stories/audio";
import VideoStory from "components/stories/video";
import { useStore } from "hooks/use-store";
import useWhyDidYouUpdate from "hooks/use-why-did-you-update";
import { observer } from "mobx-react-lite";
import { default as React, useEffect, useMemo, useState } from "react";
import Grid from "services/grid";
import * as THREE from "three";
import issues from "services/issues";
import { useThree } from "@react-three/fiber";
// import Analytics from "services/analytics";

// This offset will move all the children down a bit...
const yOffset = -3;

const StoryBrowser = observer((props) => {
  // useWhyDidYouUpdate("StoryBrowser", props);
  const store = useStore();

  const state = useThree();
  useEffect(() => {
    state.gl.setClearColor(0xffffff, 0);
  }, []);

  // If the user has changed the route, set a new activeId
  useEffect(() => {
    const id = props.pathname.replace("/", "");
    store.setActiveId(id);
    // Track route changes here when we know how
    // if (process.env.NODE_ENV === "production") {
    //   Analytics.trackRoute(props.pathname);
    // }
  }, [props.pathname]);

  // Then respond when the activeId update to move the camera etc
  useEffect(() => {
    if (store.activeItemType === "video") {
      const item = storyPositions.find((item) => {
        return item.id === store.activeId;
      });
      store.setActivePosition(
        new THREE.Vector3(item.position.x, item.position.y + yOffset, 0)
      );
    }
    if (store.activeItemType === "audio") {
      // If the user has clicked to start this audio story, there will be a 'hint'
      // which audio story to move to (keeping in mind there can be multiple audio
      // stories with the same content id). If there is no hint, that means the user
      // has come in on a deeplink, or has navigated with the browser back/forward, and
      // we dont really care which audio story to trigger
      let item;
      if (store.cameraHintId) {
        console.log("a");
        item = storyPositions.find((item) => {
          return (
            item.id === store.activeId &&
            item.cameraHintId == store.cameraHintId
          );
        });
      } else {
        item = storyPositions.find((item) => {
          return item.id === store.activeId;
        });
        console.log("b", item.id, store.activeId, item);
      }
      if (item) {
        store.setActivePosition(
          new THREE.Vector3(item.position.x, item.position.y + yOffset, 0)
        );
      } else {
        console.log("No position found?");
      }
    }
  }, [store.activeId, store.cameraHintId]);

  const [layout] = useState(() => {
    // TODO: figure out why React keeps rerendering - its MobX as the props are never changing?

    const grid = new Grid(4, "hi ram!");

    // Assign an area for the Landing page
    const initialBox = issues.MOBILE
      ? new THREE.Vector2(5, 5)
      : new THREE.Vector2(8, 5);
    grid.addBox(initialBox);
    grid.stepNulls(4);

    // Videos are added as 'boxes' in the grid... adding a box will put it into
    // a spiralling position out from the center... we can also move the
    // pointer to where the next box will be placed by adding 'nulls'
    let videoPositions = new Array(store.content.video.length).fill();
    videoPositions = videoPositions.map(() => {
      const position = grid.addBox(new THREE.Vector2(4, 4));
      if (issues.MOBILE) {
        grid.stepRandomNulls(0, 1);
      } else {
        grid.stepRandomNulls(0, 1);
      }
      return position;
    });

    // Now that the boxes are added, we need the grid to compute the empty spaces
    // between them. Once that occurs, we split these empty spaces into a practical
    // length for placing an audio story
    grid.computePartitions();
    grid.subDividePartitions(4);
    let partitions = grid.allocateRandomPartitions(grid.partitions.length, 2);

    // Sort paritions by row then column position to ensure when audio stories are rendered, they alternate
    // their ticker direction
    partitions = partitions.sort((a, b) => {
      const aPos = a.getCenter(new THREE.Vector2());
      const bPos = b.getCenter(new THREE.Vector2());
      if (aPos.y == bPos.y) {
        return aPos.x > bPos.x ? 1 : -1;
      } else {
        return aPos.y > bPos.y ? 1 : -1;
      }
    });

    store.setCameraBounds(grid.getBounds());

    return { videos: videoPositions, audio: partitions };
  });

  const [stories, storyPositions] = useMemo(() => {
    const start = performance.now();

    // This is used to map ids to positions - in the case of audio stories there could
    // be multiple stories with the same id, therefor when setting the camera position
    // we need to figure out which is closest to the camera
    const storyPositions = [];

    /*    const tmp = store.content.video.map((v) => v.id);
    console.log(tmp); */

    const videos =
      store.content &&
      store.content.video.map((props, i) => {
        const position2d = layout.videos[i];
        storyPositions.push({ id: props.id, position: position2d });
        return (
          <VideoStory
            id={props.id}
            isActive={props.id == store.activeId}
            key={`video-${i}`}
            type="video"
            position={[position2d.x, position2d.y + yOffset, 0]}
            subtitles={props.subtitles}
            hero={props.hero}
          />
        );
      });

    let contentIndex = 0;
    let hasFoundActive = false;
    const audio = layout.audio.map((partition, i) => {
      const props = store.content.audio[contentIndex];
      const position2d = partition.getCenter(new THREE.Vector2());
      const size = partition.getSize(new THREE.Vector2());
      const cameraHintId = `${props.id}-${i}`;

      const isActive = (() => {
        if (store.cameraHintId) {
          return (
            props.id === store.activeId && cameraHintId === store.cameraHintId
          );
        } else {
          return props.id === store.activeId && !hasFoundActive;
        }
      })();
      if (isActive) hasFoundActive = true;

      const story = (
        <AudioStory
          cameraHintId={cameraHintId}
          id={props.id}
          isActive={isActive}
          key={`audio-${i}`}
          type="audio"
          direction={i % 2 === 0 ? -1 : 1}
          position={[position2d.x, position2d.y + yOffset, 0]}
          quality={props.quality}
          tickerText={props.text.ticker}
          dimensions={[size.x, 1]}
        />
      );
      storyPositions.push({ cameraHintId, id: props.id, position: position2d });
      contentIndex++;
      if (contentIndex >= store.content.audio.length) contentIndex = 0;
      return story;
    });
    return [[...videos, ...audio], storyPositions];
  }, [store.activeId]);

  return (
    <>
      <Landing position={[0, 0.5, 0]} />
      {stories}
      <Lines />
      <Background position={[0, 0, -25]} />
    </>
  );
});

export default StoryBrowser;
