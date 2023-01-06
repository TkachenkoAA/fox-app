import React from 'react'
import { Image } from '../../types';

type ImageProps = {
  images?: Image[];
  onLoad: (src: string) => void;
}

export default function PreloadImages({ images, onLoad }: ImageProps) {
  if (!images) {
    return null;
  }

  return (
    <div className="board-preload">
      {images.map((image) => (
        <img key={image.src} src={image.src} onLoad={() => onLoad(image.src)} alt="" />
      ))}
    </div>
  )
}
