import React from 'react'

type GameScoreProps = {
  score: number;
}

export default function GameScore({ score }: GameScoreProps) {
  return (
    <div className="game-score">Score {score}</div>
  )
}
