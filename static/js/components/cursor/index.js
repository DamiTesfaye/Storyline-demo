import { useStore } from "hooks/use-store";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import issues from "services/issues";
import styled from "styled-components";
import DragCursor from "./drag";
import HomeCursor from "./home";
import MediaCursor from "./media";

const CursorDiv = styled(animated.div)`
  position: fixed;
  z-index: 997;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const transformString = (x, y) => `translate(${x}px,${y}px)`;

const AnimatedCursor = observer(() => {
  const store = useStore();
  const cursorDiv = useRef();
  const [cursorText, setCursorText] = useState(<span>Drag to explore.</span>);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [moveLeft, setMoveLeft] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [overHeaderArea, setOverHeaderArea] = useState(false);
  const [showDragCursor, setShowDragCursor] = useState(false);
  const [showMediaCursor, setShowMediaCursor] = useState(false);
  const [showHomeCursor, setShowHomeCursor] = useState(false);
  const [position, setPosition] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 1, tension: 500, friction: 50 },
  }));

  // Track to the mouse, also after moving for a given threshold, one
  // the drag cursors business rules is satisfied (this prevents the
  // drag cursor appearing immediatley)
  useEffect(() => {
    let movedDistance = 0;
    const movedThreshold = 15;
    const handleMouseMove = (e) => {
      if (!hasMoved && movedDistance < movedThreshold) {
        movedDistance++;
      } else if (movedDistance >= movedThreshold) {
        setHasMoved(true);
      }
      if (!issues.MOBILE) {
        setPosition({
          xy: [e.clientX, e.clientY > 100 ? e.clientY : 100],
        });
        setOverHeaderArea(e.clientY < 100 ? true : false);
        setMoveLeft(window.innerWidth - e.clientX <= 150 ? true : false);
        //setMoveLeft(e.clientX >= window.innerWidth * 0.5 ? true : false);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (store.hasDragged && store.hoverId) {
      let contentItem = toJS(store.hoverItem);
      if (!contentItem) return;
      setAnimationDelay(800);
      setCursorText(
        <>
          <span className="name">{contentItem.text.name}</span>
          <span className="location"> — {contentItem.text.location}</span>
        </>
      );
    }
  }, [store.hoverId]);

  const timeout = useRef();

  // Business rules for the Drag cursor
  useEffect(() => {
    clearTimeout(timeout.current);
    if (issues.MOBILE) {
      setShowDragCursor(false);
    } else if (hasMoved && !store.hasDragged && !store.activeId) {
      // When user first arrives
      setShowDragCursor(true);
      setShowHomeCursor(false);
    } else if (store.hoverId && !store.isDragging && !store.activeId) {
      // Hover state over stories
      timeout.current = setTimeout(() => {
        if (store.hoverId) {
          setShowDragCursor(true);
        }
      }, 300);
      setShowHomeCursor(false);
    } else if (!store.hoverId && !store.isDragging && !store.activeId) {
      // Hacky way to keep cursor on if user quickly moves from one story to another
      // In this case, we do not hide the cursor, we keep it there.
      timeout.current = setTimeout(() => {
        if (!store.hoverId) {
          setShowDragCursor(false);
        }
      }, 300);
      // setShowDragCursor(false);
    } else if (store.hasDragged || store.activeId) {
      // Hide drag cursor when watching a story
      setShowDragCursor(false);
    } else {
      setShowHomeCursor(false);
      setShowDragCursor(false);
      setShowMediaCursor(false);
    }
  }, [
    hasMoved,
    store.hasDragged,
    store.activeId,
    store.hoverId,
    store.isDragging,
  ]);

  // Business rules for the Media cursor
  useEffect(() => {
    if (store.activeId) {
      if (!issues.MOBILE) {
        setShowMediaCursor(!overHeaderArea);
      } else {
        // cursorDiv.current.style.transform = "translateX(100px) translateY(100px)";
        cursorDiv.current.style.top = "calc(100% - 60px)";
        cursorDiv.current.style.left =
          store.activeItemType === "video" ? "70px" : "50%";
        setShowMediaCursor(true);
      }
    } else {
      setShowMediaCursor(false);
    }
  }, [store.activeId, overHeaderArea]);

  useEffect(() => {
    // if (!issues.MOBILE) {
      if (store.showHomeCursor && !store.isDragging && !showDragCursor) {
        setShowHomeCursor(true);
        if (issues.MOBILE) {
          cursorDiv.current.style.top = "calc(50% - 30px)";
          cursorDiv.current.style.left = "calc(50% - 110px)";
        }
        setShowDragCursor(false);
      } else if (!store.showHomeCursor) {
        setShowHomeCursor(false);
      }
    // }
  }, [store.isDragging, store.showHomeCursor, showDragCursor]);

  useEffect(() => {
    if (store.isDragging) {
      setShowHomeCursor(false);
      setShowDragCursor(false);
      setShowMediaCursor(store.activeId ? true : false);
    }
  }, [store.isDragging]);

  return (
    <CursorDiv
      ref={cursorDiv}
      style={{ transform: position.xy.interpolate(transformString) }}
    >
      <DragCursor
        animationDelay={animationDelay}
        animate={showDragCursor ? "in" : "out"}
        moveLeft={moveLeft}
      >
        {cursorText}
      </DragCursor>
      <MediaCursor
        contentId={store.activeId}
        autoplay={store.autoplay}
        progress={store.mediaProgress}
        animate={showMediaCursor ? "in" : "out"}
        isMobile={issues.MOBILE}
      />
      <HomeCursor
        animationDelay={animationDelay}
        animate={showHomeCursor ? "in" : "out"}
      />
    </CursorDiv>
  );
});

export default AnimatedCursor;
