import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userRoleState } from '../atom';

const Auth = (WrappedComponent: React.ComponentType, requiredRole: 'admin' | 'user' = 'user') => {
  const WithAuthComponent: React.FC = (props) => {
    const userRole = useRecoilValue(userRoleState);
    const location = useLocation();

    if (userRole !== requiredRole) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default Auth;