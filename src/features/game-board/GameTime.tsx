import React, { useEffect, useState } from 'react'

type GameTimeProps = {
  ready: boolean;
  onFinish: () => void;
}

export default function GameTime({ ready, onFinish }: GameTimeProps) {
  const [time, updateTime] = useState(30);

  useEffect(() => {
    let idInterval: ReturnType<typeof setInterval> | undefined;

    if (ready) {
      idInterval = setInterval(() => {
        updateTime((time) => {
          if (time === 1) {
            onFinish();
            clearInterval(idInterval);
          }

          return time -1;
        });
      }, 1000);
    }

    return () => {
      if (idInterval) {
        clearInterval(idInterval);
      }
    }
  }, [onFinish, ready]);

  return (
    <div className="game-time">Time left: {time}</div>
  )
}
