import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userRoleState, authLoadingState } from '../atom';

const Auth = (WrappedComponent: React.ComponentType, requiredRole: 'admin' | 'user' = 'user') => {
  const WithAuthComponent: React.FC = (props) => {
    const userRole = useRecoilValue(userRoleState);
    const isAuthLoading = useRecoilValue(authLoadingState);
    const location = useLocation();
    
    if (isAuthLoading) {
      return <div>Loading...</div>;
    }

    if (userRole !== requiredRole) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default Auth;