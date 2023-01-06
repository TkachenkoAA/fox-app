import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Image, Type } from './types';

type DogImageRes = { message: string; };
type CatImageRes = { file: string; };
type FoxImageRes = { image: string; };


const resToJson = (res: Response) => res.json();
const getFoxImage = (res: FoxImageRes) => ({ id: uuidv4(), src: res.image, type: Type.fox });
const getDogImage = (res: DogImageRes) => ({ id: uuidv4(), src: res.message, type: Type.dog });
const getCatImage = (res: CatImageRes) => ({ id: uuidv4(), src: res.file, type: Type.cat });

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

const getRandomFox = () => Math.floor(Math.random() * 9);

const shuffleArray = (array: Image[]) => {
  const newArr = ([] as Image[]).concat(array);
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
}

const loadRandomImages = () => {
  const randomFox = getRandomFox();

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
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);

  const fetchInitialImages = () => loadRandomImages().then(imagesSrc => (
    setImages(imagesSrc)
  ));

  const fetchNextImages = () => loadRandomImages().then(imagesSrc => {
    const uniqueImSource = imagesSrc.filter((img) => {
      if (onloadImages.current[img.src] === undefined) {
        onloadImages.current[img.src] = false;
        return true;
      }
      return false;
    })
    setNextImages((prevImageSet) => {
      if (prevImageSet) {
        return ([] as Image[]).concat(prevImageSet, uniqueImSource);
      }
      return uniqueImSource;
    })
  })

  const getNextImageSet = useCallback(() => {
    if(!images) {
      return [];
    }

    if (!nextImages || !nextImages.length) {
      return shuffleArray(images);
    }

    // 1 - array of all images
    // 2 - 2 array of (cats + dog) and (fox)
    // 3 - get 8 numb of random and 1 in fox
    // 4 - merge
    const nextImgSet = ([] as Image[]).concat(images, nextImages.filter((img) => (
      onloadImages.current[img.src]
    )));

    const { fox, other } = nextImgSet.reduce((acc, img) => {
      if (img.type === Type.fox) {
        acc.fox.push(img);
      } else {
        acc.other.push(img);
      }
      return acc 
    }, {
      fox: [] as Image[],
      other: [] as Image[],
    });

    if (other.length < 8) {
      return shuffleArray(images);
    }

    const randomFox = getRandomFox();
    const uniqueIndexSet = new Set();
    const foxIndex = Math.floor(Math.random() * (fox.length - 1));

    while(uniqueIndexSet.size !== 8) {
      const index = Math.floor(Math.random() * (other.length - 1));
      uniqueIndexSet.add(index);
    }

    const uniqVal = [...uniqueIndexSet];
    
    const nexSet = defaultState.reduce((acc, id) => {
      if (id === randomFox) {
        acc.push(fox[foxIndex]);
      }

      if (uniqVal[id] !== undefined) {
        // @ts-ignore
        acc.push(other[uniqVal[id]]);
      }

      return acc;
    }, ([] as Image[]));

    if (nexSet.length !== 9) {
      debugger;
    }
    
    return nexSet
  }, [images, nextImages]);

  const onClick = useCallback((id: string) => {
    if (locked || !images) {
      return;
    }

    setImages(getNextImageSet());
    setScore((score) => {
      const selectedImg = images.find(img => img.id === id) as Image;

      if(selectedImg.type === Type.fox) {
        return score + 1;
      }

      return score === 0 ? 0 : score - 1;
    });
  }, [locked, images, getNextImageSet]);

  const onLoad = useCallback((src: string) => {
    onloadImages.current[src] = true;;

    if (!ready && images?.every(img => onloadImages.current[img.src])) {
      setReady(true);
    }
  }, [ready, images, setReady])

  const onFinish = useCallback(() => {
    setLocked(true)
  }, [setLocked])

  useEffect(() => {
    fetchInitialImages().catch(fetchInitialImages).then(
      () => fetchNextImages().catch(fetchNextImages)
    )
  }, []);
  
  useEffect(() => {
    if (nextImages && nextImages.length > 200) {
      return;
    }

    if (ready && !locked) {
      fetchNextImages().catch(fetchInitialImages);
    }
  }, [nextImages, locked, ready]);

  return {
    locked,
    score,
    ready,
    images,
    nextImages,
    onClick,
    onLoad,
    onFinish,
  }
}