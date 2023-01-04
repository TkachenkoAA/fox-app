import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewGame() {
  const navigate = useNavigate();

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
  }
  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
  }
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
    };

    if (target['name'].value) {
      navigate('/game');
    }
  }

  return (
    <form className="NewGame" onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
      />
      <button type="submit">PLAY!</button>
   </form>
  );
}
