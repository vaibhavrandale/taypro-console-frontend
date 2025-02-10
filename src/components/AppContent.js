import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

// routes config
import routes from '../routes';
import Dashboard from '../views/dashboard/Dashboard';

const AppContent = () => {
  return (
    <div className="mx-3 my-2">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          {/* <Route path="/" element={<Dashboard />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default React.memo(AppContent);
