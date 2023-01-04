import React from 'react';
import GameBoard from '../features/game-board/GameBoard';
import GameScore from '../features/game-board/GameScore';
import GameTime from '../features/game-board/GameTime';
import idsLoadImages from '../features/game-board/loadImages';
import PreloadImages from '../features/game-board/PreloadImages';

export default function Game() {
  const { score, ready, images, nextImages, onClick, onLoad } = idsLoadImages();

  return (
    <div className="game">
      <div className="game-header">
        <GameScore score={score} />
        <GameTime />
      </div>
      <GameBoard
        ready={ready}
        images={images}
        onClick={onClick}
        onLoad={onLoad}
      />
      <PreloadImages
        images={nextImages}
        onLoad={onLoad}
      />
    </div>
  );
}
