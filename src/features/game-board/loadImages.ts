import { useEffect, useRef, useState } from "react";
import { Image, Type } from './types';

type DogImageRes = { message: string; };
type CatImageRes = { file: string; };
type FoxImageRes = { image: string; };


const resToJson = (res: Response) => res.json();
const getFoxImage = (res: FoxImageRes) => ({ src: res.image, type: Type.fox });
const getDogImage = (res: DogImageRes) => ({ src: res.message, type: Type.dog });
const getCatImage = (res: CatImageRes) => ({ src: res.file, type: Type.cat });

const defaultState = [...new Array(9).keys()] as number[];

const dog = () => fetch('https://dog.ceo/api/breeds/image/random')
  .then(resToJson)
  .then(getDogImage);
const cat = () => fetch('https://aws.random.cat/meow')
  .then(resToJson)
  .then(getCatImage);
const fox = () => fetch('https://randomfox.ca/floof/')
  .then(resToJson)
  .then(getFoxImage);

const loadRandomImages = () => {
  const randomFox = Math.floor(Math.random() * 9);

  return Promise.all(
    defaultState.map(id => {
      if (id === randomFox) {
        return fox();
      }
      if (Boolean(Math.floor(Math.random() * 2))) {
        return dog();
      }
      return cat();
    })
  )
}

export default function useLoadImages() {
  const onloadImages = useRef<{ [x: string]: boolean }>({});
  const [images, setImages] = useState<Image[]>();
  const [nextImages, setNextImages] = useState<Image[]>();
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(0);

  const onClick = (id: number) => {
    if (!images) {
      return;
    }

    if (images[id].type === Type.fox) {
      setReady(false);
      setScore((score) => score + 1);
      setImages(nextImages);
      return;
    }
    setReady(false);
    setScore((score) => score - 1);
    setImages(nextImages);
  };
  const onLoad = (src: string) => {
    onloadImages.current[src] = true;;

    if (!ready && images?.every(img => onloadImages.current[img.src])) {
      setReady(true);
    }
  }

  useEffect(() => {
    loadRandomImages().then(imagesSrc => {
      setImages(() => defaultState.map(
        (id) => ({ id, src: imagesSrc[id].src, type: imagesSrc[id].type })
      ))
    })
  }, []);

  useEffect(() => {
    if (ready) {
      loadRandomImages().then(imagesSrc => {
        setNextImages(() => defaultState.map(
          (id) => ({ id, src: imagesSrc[id].src, type: imagesSrc[id].type })
        ))
      }).catch()
    }
  }, [ready])

  return {
    score,
    ready,
    images,
    nextImages,
    onClick,
    onLoad,
  }
}