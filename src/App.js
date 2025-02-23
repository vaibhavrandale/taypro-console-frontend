// function App() {
//   return <>Vaibhav</>;
// }

// export default App;

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './App.css';

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss';
import { Toaster } from 'react-hot-toast';
import ResetPassword from './views/pages/reset-password/ResetPassword';
import ForgotPassword from './views/pages/reset-password/ForgotPassword';
import NetworkStatus from './views/NetworkStatus';
// import UserBasedLinkDashboard from './views/dashboard/UserBasedLinkDashboard';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme =
      urlParams.get('theme') &&
      urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // <HashRouter>

    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <NetworkStatus />
        <Routes>
          <Route
            exact
            path="/reset-password"
            name="Reset Password"
            element={<ResetPassword />}
          />
          <Route
            exact
            path="/forgot-password"
            name="Reset Password"
            element={<ForgotPassword />}
          />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={<Register />}
          />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="User Dashboard" element={<DefaultLayout />} />
          {/* <Route
            exact
            path="/user-dashboard"
            name="User Dashboard"
            element={<UserBasedLinkDashboard />}
          /> */}
        </Routes>
      </Suspense>
      <Toaster
        position="top-center"
        // ... other configurations
      />
      {/* </HashRouter> */}
    </BrowserRouter>
  );
};

export default App;
