import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Type } from '../../types';
import { fetchDog, fetchCat, fetchFox } from './fetchImageSources';
import { defaultState, getRandomOnBoard, getRandomBoolean } from './utils';

const shuffleArray = (array: Image[]) => {
  const newArr = ([] as Image[]).concat(array);
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
}

const loadRandomImages = () => {
  const randomFox = getRandomOnBoard();

  return Promise.all(
    defaultState.map(id => {
      if (id === randomFox) {
        return fetchFox();
      }
      if (Boolean(getRandomBoolean())) {
        return fetchDog();
      }
      return fetchCat();
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

    // 1 - array of all downloaded images
    // 2 - two array of (cats + dog) and (fox)
    // 3 - get 8 numb of random and 1 in fox
    // 4 - merge into next image set
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

    if ((other.length + fox.length) === 9) {
      return shuffleArray(images);
    }

    const uniqueIndexSet = new Set();

    const currentFoxIndex = images.findIndex((img) => img.type === Type.fox);
    const currentImageSource = images[currentFoxIndex].src;

    let nextFoxPosition = getRandomOnBoard();
    let nextFoxIndex = Math.floor(Math.random() * fox.length);
    let nextFoxSource = fox[nextFoxIndex].src

    while(
      (uniqueIndexSet.size !== 8) ||
      (currentFoxIndex === nextFoxPosition) ||
      ((currentImageSource === nextFoxSource) && fox.length > 1)
    ) {
      if (uniqueIndexSet.size !== 8) {
        uniqueIndexSet.add(
          Math.floor(Math.random() * other.length)
        );
      }
      if (currentFoxIndex === nextFoxPosition) {
        nextFoxPosition = getRandomOnBoard();
      }
      if ((currentImageSource === nextFoxSource) && (fox.length > 1)) {
        nextFoxIndex = Math.floor(Math.random() * fox.length);
        nextFoxSource = fox[nextFoxIndex].src;
      }
    }

    const uniqVal = [...uniqueIndexSet] as number[];
    
    const nexSet = defaultState.reduce((acc, id) => {
      if (id === nextFoxPosition) {
        acc.push(fox[nextFoxIndex]);
      }

      if (uniqVal[id] !== undefined) {
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