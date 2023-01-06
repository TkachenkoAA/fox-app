import React from 'react';
import ImageContainer from './ImageContainer';
import { Image } from './types';

type GameBoardProps = {
  images?: Image[];
  ready: boolean;
  onClick: (id: string) => void;
  onLoad: (src: string) => void;
}

export default function GameBoard({ images, ready, onClick, onLoad }: GameBoardProps) {
  if (!images) {
    return (
      <div className="game-board">Be ready...</div>
    );
  }

  if (images.length > 9) {
    debugger;
  }

  return (
    <div className="game-board">
      {images.map((image) => (
        <ImageContainer
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
