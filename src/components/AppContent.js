import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";

const AppContent = () => {
  const Page404 = React.lazy(() => import("../views/pages/page404/Page404"));

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
                  element={route.element} // ✅ FIXED
                />
              )
            );
          })}

          {/* Catch-all route for 404 */}
          <Route
            path="*"
            element={
              <React.Suspense fallback={<CSpinner />}>
                <Page404 />
              </React.Suspense>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default React.memo(AppContent);
