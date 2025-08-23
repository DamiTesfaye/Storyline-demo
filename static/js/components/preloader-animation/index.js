import { useStore } from "hooks/use-store";
import { observer } from "mobx-react-lite";
import React from "react";
import ClipRect from "./clip-rect";
import Spinner from "./spinner";

const PreloaderAnimation = observer(() => {
  const store = useStore();
  return (
    <>
      <Spinner ready={store.appReady} />
      <ClipRect ready={store.appReady} />
    </>
  );
});

export default PreloaderAnimation;
