import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameBoard from '../features/game-board/GameBoard';
import GameScore from '../features/game-board/GameScore';
import GameTime from '../features/game-board/GameTime';
import idsLoadImages from '../features/game-process/loadImages';
import PreloadImages from '../features/game-board/PreloadImages';
import { routePath } from '../routePath';

export default function Game() {
  const { state } = useLocation();
  const navigate = useNavigate()
  const {
    score,
    locked,
    ready,
    images,
    nextImages,
    onClick,
    onLoad,
    onFinish
  } = idsLoadImages();

  useEffect(() => {
    if (!state || !state.name) {
      navigate(routePath.home);
    }
  }, [navigate, state])

  useEffect(() => {
    if (locked) {
      alert(`Well done! Game is over! Your score ${score}`);
      navigate(routePath.score, {
        state: {
          name: state.name, 
          score: score,
        }
      });
    }
  }, [locked, score, navigate, state])

  return (
    <div className="game">
      <div className="game-header">
        <GameScore score={score} />
        <GameTime ready={ready} onFinish={onFinish} />
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
