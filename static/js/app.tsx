import CameraControls from "components/camera-controls";
import Cursor from "components/cursor";
import FixedHTML from "components/fixed-html";
import Post from "components/postprocessing/post-processing";
import Preloader from "components/preloader";
import PreloaderAnimation from "components/preloader-animation/";
import DomContainer from "containers/dom-container";
import StoryBrowser from "containers/story-browser";
import { createBrowserHistory } from "history";
import { useStore } from "hooks/use-store";
import "pepjs";
import React, { Suspense, useEffect, useState } from "react";
import { Route, Router } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Analytics from "services/analytics";
import glQuality from "services/gl-quality";
import issues from "services/issues";
const serviceURL = "data/content.json";

const useFetch = <T = any>(url: string, options?: RequestInit): T | null => {
  const [response, setResponse] = useState<T | null>(null);
  useEffect(() => {
    const doFetch = async () => {
      const res = await fetch(url, options);
      const json = await res.json();
      setResponse(json);
    };
    void doFetch();
  }, [url, options]);
  return response;
};

const App: React.FC = () => {
  const store = useStore();
  const history = createBrowserHistory({
    basename: process.env.NODE_ENV === "production" ? "/storyline" : "/",
  });
  const data = useFetch<any>(serviceURL);
  useEffect(() => {
    if (data) {
      // Randomise the video content so things feel fresh on revisits
      data.video = data.video.sort(() => (Math.random() > 0.5 ? -1 : 1));
      store.setContent(data);
    }
  }, [data]);

  useEffect(() => {
    history.location.pathname === "/"
      ? store.setAutoplayState(true)
      : store.setAutoplayState(issues.AUTOPLAY);
  }, [issues.AUTOPLAY]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Analytics.init();
    }
  }, []);

  const maxPixelRatio = glQuality.get() < glQuality.HIGH ? 1.5 : 2;

  return (
    <div id="app">
      {!data ? null : (
        <Router history={history}>
          <div id="ui">
            <PreloaderAnimation />
            <Cursor />
            <DomContainer />
          </div>
          <Canvas
            id="three-canvas"
            style
            concurrent={true /* issues.USE_CONCURRENT */}
            gl={{
              powerPreference: "high-performance",
            }}
            pixelRatio={Math.min(window.devicePixelRatio, maxPixelRatio)}
          >
            <CameraControls />
            <Suspense fallback={<FixedHTML children={<Preloader />} />}>
              <ambientLight intensity={1} />
              <Post />
              <Router history={history}>
                <Route
                  path="/:id?"
                  render={(routeProps) => {
                    return (
                      <StoryBrowser
                        key="story-browser"
                        pathname={routeProps.location.pathname}
                      />
                    );
                  }}
                />
              </Router>
            </Suspense>
          </Canvas>
        </Router>
      )}
    </div>
  );
};

export default App;
