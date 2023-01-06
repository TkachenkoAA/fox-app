
export const Type = {
  fox: 'fox',
  dog: 'dog',
  cat: 'cat',
} as const;

export type Image = {
  id: string;
  src: string;
  type: keyof typeof Type
};

export type DogImageRes = {
  message: string;
};

export type CatImageRes = {
  file: string;
};

export type FoxImageRes = {
  image: string;
};
