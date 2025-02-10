import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { store } from '../store';

export default function ProtectedRoutes({ children }) {
  const { state } = useContext(store);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/login" />;
}
