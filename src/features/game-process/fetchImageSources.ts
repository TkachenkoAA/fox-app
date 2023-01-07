import { v4 as uuidv4 } from 'uuid';
import { Type, FoxImageRes, DogImageRes, CatImageRes } from './types';

const resToJson = (res: Response) => res.json();

const getFoxImage = (res: FoxImageRes) => ({
  id: uuidv4(),
  src: res.image,
  type: Type.fox
});

const getDogImage = (res: DogImageRes) => ({
  id: uuidv4(),
  src: res.message,
  type: Type.dog
});

const getCatImage = (res: CatImageRes) => ({
  id: uuidv4(),
  src: res.file,
  type: Type.cat
});

export const fetchDog = () => fetch('https://dog.ceo/api/breeds/image/random')
  .then(resToJson)
  .then(getDogImage);
export const fetchCat = () => fetch('https://aws.random.cat/meow')
  .then(resToJson)
  .then(getCatImage);
export const fetchFox = () => fetch('https://randomfox.ca/floof/')
  .then(resToJson)
  .then(getFoxImage);