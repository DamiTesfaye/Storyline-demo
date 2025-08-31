import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const useTextureLoader = (
  urlOrURLs: string | string[]
): THREE.Texture | THREE.Texture[] => {
  const textureOrTextures = useLoader(
    THREE.TextureLoader,
    urlOrURLs,
    () => {}
  );
  return textureOrTextures as THREE.Texture | THREE.Texture[];
};

export default useTextureLoader;
