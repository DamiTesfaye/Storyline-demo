import { useEffect, useState } from "react";
import usePromise from "react-promise-suspense";
import * as THREE from "three";

const items = [];

const search = (url) => {
  return (item) => {
    return item.url === url;
  };
};

const cache = {
  get: (url) => {
    const item = items.find(search(url));
    if (item) return item.value;
  },
  set: (url, value) => {
    const item = items.find(search(url));
    if (item) {
      item.value = value;
    } else {
      items.push({ url, value });
    }
  },
};

const load = (urlOrURLs) => {
  return new Promise((resolve, reject) => {
    // We can accept a url or a list of urls as args, but we need to remember to return
    // the correct type... a texture or a list of textures
    const isArray = Array.isArray(urlOrURLs);
    let urls = isArray ? urlOrURLs : [urlOrURLs];
    let textures;

    // Our callback for textures that need to get loaded - have we loaded all of them?
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

    // Map our urls to textures. In some instances, the texture for a given url may already be in
    // the cache
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

const useLazyTextureLoader = (urlOrURLs) => {
  const deps = Array.isArray(urlOrURLs) ? urlOrURLs : [urlOrURLs];
  const [result, setResult] = useState(
    Array.isArray(urlOrURLs) ? [new Array(urlOrURLs.length).fill(null)] : null
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

export const useSuspendedTextureLoader = (urlOrURLs) => {
  const results = usePromise(load, [urlOrURLs]);
  return results;
};

export default useLazyTextureLoader;
