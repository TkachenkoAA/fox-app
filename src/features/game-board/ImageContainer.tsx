import React from 'react'
import classNames from 'classnames';

type ImageProps = {
  id: number;
  src: string;
  ready: boolean;
  onClick: (id: number) => void;
  onLoad: (src: string) => void;
}

export default function ImageContainer ({ id, src, ready, onClick, onLoad }: ImageProps) {
  const handleClick = () => {
    if (!ready) {
      return;
    }
    onClick(id);
  }
  const handleLoad = () => onLoad(src);

  return (
    <button className="board-block" onClick={handleClick}>
      <img className={classNames('board-content', {
        'board-content-ready': ready
      })} src={src} onLoad={handleLoad} alt="" />
    </button>
  )
}
