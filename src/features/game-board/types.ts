
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