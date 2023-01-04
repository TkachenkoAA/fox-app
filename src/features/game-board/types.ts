
export const Type = {
  fox: 'fox',
  dog: 'dog',
  cat: 'cat',
} as const;

export type Image = {
  id: number;
  src: string;
  type: keyof typeof Type
};