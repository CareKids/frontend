import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { loginState, userRoleState, authLoadingState } from '../atom';
import { checkAuthStatus } from '../api/login';

function Auth() {
  const setIsLoggedIn = useSetRecoilState(loginState);
  const setUserRole = useSetRecoilState(userRoleState);
  const setAuthLoading = useSetRecoilState(authLoadingState);

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        const response = await checkAuthStatus();
        const { user_role, is_login } = response;
        setIsLoggedIn(is_login === 'true');
        setUserRole(user_role === 'ROLE_ADMIN' ? 'admin' : 'user');
      } catch (error) {
        console.error('Failed to verify auth status:', error);
      } finally {
        setAuthLoading(false);
      }
    };
    
    verifyAuth();
  }, [setIsLoggedIn, setUserRole, setAuthLoading]);

  return null;
}

export default Auth;