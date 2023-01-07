import React from 'react';
import ImageContainer from './ImageContainer';
import { Image } from '../game-process/types';

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
