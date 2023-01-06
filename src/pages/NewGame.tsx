import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routePath } from '../routePath';

export default function NewGame() {
  const navigate = useNavigate();
  const { state: historyState } = useLocation();
  const [state, setEditable] = useState({
    isEditable: true,
    inputValue: historyState ? historyState.name : ''
  })

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    setEditable(() => ({
      inputValue: event.target.value,
      isEditable: false
    }))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string, focus: () => void },
    };

    if (target['name'].value || state.inputValue) {
      navigate(routePath.game, {
        state: {
          name: target['name'].value || state.inputValue
        }
      });
      return;
    } 
    if (!state.isEditable) {
      setEditable((prev) => ({ ...prev, isEditable: true }));
      return;
    }

    if (target['name']) {
      target['name'].focus();
    }
  }

  const startEditingName = () => {
    setEditable((prev) => ({ ...prev, isEditable: true }))
  }

  return (
    <form className="welcome" onSubmit={handleFormSubmit}>
      {state.isEditable ? (
        <>
          <label className="welcome-label" htmlFor="welcome-input">Name</label>
          <input
            id="welcome-input"
            type="text"
            name="name"
            autoFocus
            defaultValue={state.inputValue}
            className="welcome-input"
            onBlur={handleInputBlur}
          />
        </>
      ) : (
        <button
          className="welcome-name"
          onClick={startEditingName}
        >
          Hello {state.inputValue}
        </button>
      )}
      <button type="submit" className="welcome-action">PLAY!</button>
   </form>
  );
}
