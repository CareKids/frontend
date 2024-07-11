import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { loginState, userRoleState } from '../atom';
import { checkAuthStatus } from '../api/login';

function Auth() {
  const setIsLoggedIn = useSetRecoilState(loginState);
  const setUserRole = useSetRecoilState(userRoleState);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuthStatus();
        const { user_role, is_login } = response;

        // 로그인 상태 설정
        setIsLoggedIn(is_login === 'true');

        // 사용자 역할 설정
        if (user_role === 'ROLE_ADMIN') {
          setUserRole('admin');
        } else {
          setUserRole('user');
        }
      } catch (error) {
        console.error('Failed to verify auth status:', error);
        setIsLoggedIn(false);
        setUserRole('user');
      }
    };
    
    verifyAuth();
  }, [setIsLoggedIn, setUserRole]);

  return null;
}

export default Auth;