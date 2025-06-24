import React from 'react'
import { Navigate , Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default PrivateRoute

