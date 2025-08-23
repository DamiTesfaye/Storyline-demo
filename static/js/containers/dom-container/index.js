import FilterMenu from "components/filter-menu";
import Logo from "components/logo";
import Recorder from "components/recorder";
import ShareMenu from "components/share-menu";
import { useStore } from "hooks/use-store";
import { observer } from "mobx-react-lite";
import React from "react";
import { animated } from "react-spring";
import styled from "styled-components";

const DomDiv = styled(animated.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 100;
  user-select: none;

  @media (orientation: landscape) and (max-width: 1024px) {
    display: none;
  }

  > * {
    pointer-events: auto;
  }
`;

const DomContainer = observer(() => {
  const store = useStore();
  const animate = store.showUI && !store.activeId ? "in" : "out";
  return (
    <DomDiv>
      <Logo animate={animate} />
      <ShareMenu />
      <FilterMenu animate={animate} />
      <Recorder animate={animate} />
    </DomDiv>
  );
});

export default DomContainer;
