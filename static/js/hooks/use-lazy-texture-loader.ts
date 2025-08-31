import { useEffect, useState } from "react";
import usePromise from "react-promise-suspense";
import * as THREE from "three";

const items: { url: string; value: THREE.Texture }[] = [];

const search = (url: string) => {
  return (item: { url: string }) => {
    return item.url === url;
  };
};

const cache = {
  get: (url: string) => {
    const item = items.find(search(url));
    if (item) return item.value;
  },
  set: (url: string, value: THREE.Texture) => {
    const item = items.find(search(url));
    if (item) {
      item.value = value;
    } else {
      items.push({ url, value });
    }
  },
};

const load = (
  urlOrURLs: string | string[]
): Promise<THREE.Texture | THREE.Texture[]> => {
  return new Promise((resolve) => {
    const isArray = Array.isArray(urlOrURLs);
    const urls = isArray ? urlOrURLs : [urlOrURLs];
    let textures: THREE.Texture[] = [];

    let toLoad = 0;
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === toLoad) {
        if (isArray) {
          resolve(textures);
        } else {
          resolve(textures[0]);
        }
      }
    };

    textures = urls.map((url) => {
      const cached = cache.get(url);
      if (cached) {
        return cached;
      } else {
        toLoad++;
        const loader = new THREE.TextureLoader();
        const texture = loader.load(url, onLoad);
        cache.set(url, texture);
        return texture;
      }
    });
  });
};

const useLazyTextureLoader = (
  urlOrURLs: string | string[]
): THREE.Texture | THREE.Texture[] | null => {
  const deps = Array.isArray(urlOrURLs) ? urlOrURLs : [urlOrURLs];
  const [result, setResult] = useState<
    THREE.Texture | THREE.Texture[] | null
  >(
    Array.isArray(urlOrURLs) ? new Array(urlOrURLs.length).fill(null) : null
  );
  useEffect(() => {
    const f = async () => {
      const r = await load(urlOrURLs);
      setResult(r);
    };
    f();
  }, deps);
  return result;
};

export const useSuspendedTextureLoader = (
  urlOrURLs: string | string[]
): THREE.Texture | THREE.Texture[] => {
  const results = usePromise(load, [urlOrURLs]);
  return results as THREE.Texture | THREE.Texture[];
};

export default useLazyTextureLoader;
