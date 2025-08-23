import React, { Suspense } from "react";
import issues from "services/issues";
import LandingDesktop from "./landing-desktop";
import LandingMobile from "./landing-mobile";

const Landing = (props) => {
  return (
    <group position={props.position}>
      {issues.MOBILE ? (
        <LandingMobile position={[0, 0.5, 0]} />
      ) : (
        <LandingDesktop position={[0, 0.5, 0]} />
      )}
    </group>
  );
};

export default Landing;
