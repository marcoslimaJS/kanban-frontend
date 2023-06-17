import React from 'react';
// import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const { user } = useSelector((state) => state.auth);

  return user && token && userId ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
