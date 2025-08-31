import { useStore } from "hooks/use-store";
import { observer } from "mobx-react-lite";
import {
  BlendFunction,
  BlendMode,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import { default as React, useEffect, useMemo } from "react";
import { animated, useSpring } from "@react-spring/three";
import { extend, useFrame, useThree } from "react-three-fiber";
import glQuality from "services/gl-quality";
import issues from "services/issues";
import { BarrelEffect } from "./effects/barrel";
import { ColorVignetteEffect } from "./effects/color-vignette";
extend({ EffectComposer, RenderPass, EffectPass, ColorVignetteEffect });

const FX = animated((props) => {
  const { gl, scene, camera, size } = useThree();

  const [composer, barrel] = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const effects = [];

    let barrel;
    /* if (!issues.MOBILE) { */
    barrel = new BarrelEffect({
      useEdgeDither: glQuality.get() >= glQuality.HIGH,
      strength: 1,
    });
    barrel.blendMode = new BlendMode(BlendFunction.NORMAL, 1);
    effects.push(barrel);
    /* } */

    let vignette;
    if (glQuality.get() >= glQuality.HIGH /* && !issues.MOBILE */) {
      const params = issues.MOBILE
        ? { scale: 2, strength: 0.65 }
        : { scale: 1, strength: 1 };

      vignette = new ColorVignetteEffect(params);
      vignette.blendMode = new BlendMode(BlendFunction.SCREEN, 1);
      effects.push(vignette);
    }

    const effectPass = new EffectPass(camera, ...effects);
    composer.addPass(effectPass);
    return [composer, barrel, vignette];
  }, [camera, gl, scene]);

  useEffect(() => {
    if (barrel) barrel.strength = props.barrelStrength;
  }, [barrel, props.barrelStrength]);

  useEffect(() => void composer.setSize(size.width, size.height), [
    composer,
    size,
  ]);

  return useFrame((_, delta) => composer.render(delta), 1);
});

const Post = observer(() => {
  const store = useStore();
  const maxStrength = issues.MOBILE ? 0.4 : 1;

  const [props, set] = useSpring(() => {
    return {
      barrelStrength: store.activeId ? 0 : maxStrength,
      config: { mass: 1, tension: 40, friction: 30 },
    };
  });

  useEffect(() => {
    if (issues.MOBILE) {
      // On Mobile, the landing screen isn't distorted... but as soon as the user scrolls
      // away from it it should warp
      if (store.hasDragged && !store.activeId) {
        set({ barrelStrength: maxStrength });
      } else {
        set({ barrelStrength: 0 });
      }
    } else {
      // On Desktop its OK to distort the landing page... but otherise not distort things
      // if there is an activeId (so video isnt distorted)
      set({ barrelStrength: store.activeId ? 0 : maxStrength });
    }
  }, [set, store.activeId, store.hasDragged]);

  // return (() => {
  //   if (glQuality.get() <= glQuality.LOW /* || issues.MOBILE */) return <></>;
  //   return <FX {...props} />;
  // })();

  if (glQuality.get() <= glQuality.LOW /* || issues.MOBILE */) return null;
  return <FX {...props} />;


});

export default Post;
