import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="App">
      <h1>Click the Fox! Game</h1>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
}
