import { Suspense } from 'react';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { HeaderPage } from '../pages/Header';
import { routes } from './router';

const AppRouter: React.FC = () => {
  return (
    <Suspense>
      <BrowserRouter basename="/news-app">
        <HeaderPage />
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="/*" element={<Navigate replace to="/home" />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRouter;
