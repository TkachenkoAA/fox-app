import React from 'react';
import ImageContainer from './ImageContainer';
import PreloadImageContainer from './PreloadImages';
import { Image } from './types';

type GameBoardProps = {
  images?: Image[];
  ready: boolean;
  onClick: (id: number) => void;
  onLoad: (src: string) => void;
}

export default function GameBoard({ images, ready, onClick, onLoad }: GameBoardProps) {
  if (!images) {
    return null;
  }

  return (
    <div className="game-board">
      {images.map((image) => (
        <ImageContainer
          key={image.src}
          id={image.id}
          src={image.src}
          ready={ready}
          onClick={onClick}
          onLoad={onLoad}
        />
      ))}
    </div>
  );
}
