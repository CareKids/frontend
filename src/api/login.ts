import { SignUpData, LoginData } from '../api/types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const sendVerificationEmail = async (emailId: string, emailDomain: string): Promise<void> => {
  const fullEmail = `${emailId}@${emailDomain}`;
  try {
    const response = await fetch(`${BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: fullEmail }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const verifyEmailCode = async (emailId: string, emailDomain: string, code: string): Promise<boolean> => {
  const fullEmail = `${emailId}@${emailDomain}`;
  try {
    const response = await fetch(`${BASE_URL}/api/auth-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: fullEmail, code: code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result['message'] === '이메일 검증이 완료되었습니다.';
  } catch (error) {
    console.error('Error verifying email code:', error);
    throw error;
  }
};

export const checkNicknameAvailability = async (nickname: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/api/signup/auth-nickname`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    });
    const data = await response.json();
    return data['message'] === '중복된 닉네임이 존재하지 않습니다.';
  } catch (error) {
    console.error('Error checking nickname:', error);
    throw error;
  }
};

export const signUp = async (signUpData: SignUpData): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signUpData.email,
        password: signUpData.password,
        nickname: signUpData.nickname,
        'social-type': signUpData.socialType,
        region: signUpData.region,
        'age-tag': signUpData.ageTags
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const Login = async (LoginData: LoginData): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: LoginData.email,
        password: LoginData.password
      }),
      credentials: 'include',
      redirect: 'manual'
    });

    if (response.type === 'opaqueredirect') {      
      window.location.href = '/';
      return { success: true, message: "리다이렉트됨" };
    }

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};

export const checkAuthStatus = async() => {
  try {
    const response = await fetch(`${BASE_URL}/api/login-check`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export const changePassword = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/password-change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user-email": email,
        "new-password": password
      }),
      credentials: 'include',
      redirect: 'manual'
    });

    if (response.type === 'opaqueredirect') {      
      window.location.href = '/';
      return { success: true, message: "리다이렉트됨" };
    }

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};