import { useStore } from "hooks/use-store";
import React, { useEffect } from "react";

const Preloader = () => {
  const store = useStore();

  useEffect(() => {
    document.body.style.pointerEvents = "none";
    return () => {
      document.body.style.pointerEvents = "auto";
      store.setAppReady(true);
    };
  }, []);

  return <></>;
};

export default Preloader;
