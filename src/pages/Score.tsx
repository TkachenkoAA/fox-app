import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate, useBeforeUnload } from 'react-router-dom';
import { routePath } from '../routePath';

type Player = {
  id: string;
  name: string;
  date: string;
  score: number;
}

const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Score() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [scoreBoard] = useState<Array<Player>>(() => {
    const scoreStore = localStorage.getItem('score');
    const score = [] as Player[];

    if (state) {
      const date = new Date();
      score.push({
        id: uuidv4(),
        name: state.name,
        date: `${date.getFullYear()}, ${monthMap[date.getMonth()]} ${date.getDate()}`,
        score: state.score,
      });
    }

    if (scoreStore) {
      const prevPlayers = JSON.parse(scoreStore) as Player[];

      score.push(...prevPlayers);
    }

    return score.sort((a, b) => b.score - a.score)
  });

  const replaceState = useCallback(() => {
    console.log('replaceState !!!')
    window.history.replaceState({}, document.title)
  }, [])

  useEffect(() => {
    if (scoreBoard.length) {
      localStorage.setItem('score', JSON.stringify(scoreBoard));
    }
  }, [scoreBoard]);

  useBeforeUnload(replaceState)

  const navigateToWelcome = () => {
    if (state) {
      navigate(routePath.home, {
        state: {
          name: state.name
        }
      });
      return;
    }

    navigate(routePath.home)
  }

  const navigateToGame = () => {
    if (state) {
      navigate(routePath.game, {
        state: {
          name: state.name
        }
      });
      return;
    }
    navigate(routePath.home);
  }

  return (
    <div className="score">
      <div className="score-items">
        <div className="score-item score-head">
          <div className="score-value score-rank">Rank</div>
          <div className="score-value">Name</div>
          <div className="score-value">Date</div>
          <div className="score-value">Score</div>
        </div>
        {scoreBoard.length ? scoreBoard.map((player, index) => (
          <div key={player.id} className={classNames('score-item', { 'score-item-odd': index % 2 === 1 })}>
            <div className="score-value score-rank">{index}</div>
            <div className="score-value">{player.name}</div>
            <div className="score-value">{player.date}</div>
            <div className="score-value">{player.score}</div>
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
