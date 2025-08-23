import { useLoader } from "react-three-fiber";
import * as THREE from "three";

const useTextureLoader = (urlOrURLs) => {
  const textureOrTextures = useLoader(
    THREE.TextureLoader,
    urlOrURLs,
    (loader) => {}
  );
  return textureOrTextures;
};

export default useTextureLoader;
