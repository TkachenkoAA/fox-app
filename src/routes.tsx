import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './pages/NotFound';

const NewGame = lazy(
  () => import('./pages/NewGame')
);
const GameBoard = lazy(
  () => import('./pages/GameBoard')
);
const Score = lazy(
  () => import('./pages/Score')
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [{
      path: '',
      element: <NewGame />,
    }, {
      path: 'game',
      element: <GameBoard />,
    }, {
      path: 'score',
      element: <Score />,
    }],
  }, {
    path: '*',
    element: <NotFound />
  },
]);

