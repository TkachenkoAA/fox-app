import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import NotFound from './pages/NotFound';
import { routePath } from './routePath';

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
    path: routePath.home,
    element: <AppLayout />,
    children: [{
      path: '',
      element: <NewGame />,
    }, {
      path: routePath.game,
      element: <GameBoard />,
    }, {
      path: routePath.score,
      element: <Score />,
    }],
  }, {
    path: routePath.notFound,
    element: <NotFound />
  },
]);

