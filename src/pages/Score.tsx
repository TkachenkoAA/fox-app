import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { routePath } from '../routePath';

type Player = {
  name: string;
  date: number;
  score: number;
}

export default function Score() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [scoreBoard] = useState<Array<Player>>(() => {
    const scoreStore = localStorage.getItem('score');
    const score = [] as Player[];

    if (state) {
      score.push({
        name: state.name,
        date: Date.now(),
        score: state.score,
      });
    }

    if (scoreStore) {
      const prevPlayers = JSON.parse(scoreStore) as Player[];

      score.push(...prevPlayers);
    }

    return score.sort((a, b) => b.score - a.score);
  });

  useEffect(() => {
    if (scoreBoard.length) {
      localStorage.setItem('score', JSON.stringify(scoreBoard));
    }
  }, [scoreBoard]);

  useEffect(() => {
    if (state) {
      window.history.replaceState({}, document.title)
    }
  }, [state]);

  const navigateToWelcome = () => navigate(routePath.home);
  const navigateToGame = () => navigate(routePath.game, {
    state: {
      name: state.name
    }
  });

  return (
    <div className="score">
      <div className="score-items">
        <div className="score-item score-head">
          <div className="score-rank">Rank</div>
          <div className="score-name">Name</div>
          <div className="score-date">Date</div>
          <div className="score-score">Score</div>
        </div>
        {scoreBoard.length ? scoreBoard.map((player, index) => (
          <div className={classNames('score-item', { 'score-item-odd': index % 2 === 1 })}>
            <div className="score-rank">{index}</div>
            <div className="score-name">{player.name}</div>
            <div className="score-date">{player.date}</div>
            <div className="score-score">{player.score}</div>
          </div>
        )) : null}
      </div>
      <div className="score-footer">
        <button onClick={navigateToWelcome} className="score-action">To Welcome Screen</button>
        <button onClick={navigateToGame} className="score-action">PLAY!</button>
      </div>
    </div>
  );
}
