import React from 'react'
import classNames from 'classnames';

type ImageProps = {
  id: string;
  src: string;
  ready: boolean;
  onClick: (id: string) => void;
  onLoad: (src: string) => void;
}

export default function ImageContainer ({ id, src, ready, onClick, onLoad }: ImageProps) {
  const handleClick = () => onClick(id);
  const handleLoad = () => onLoad(src);

  const imgClassName = classNames('board-content', {
    'board-content-ready': ready
  })

  return (
    <button className="board-block" onClick={handleClick}>
      <img className={imgClassName} src={src} onLoad={handleLoad} alt="" />
    </button>
  )
}
