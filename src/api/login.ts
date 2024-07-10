const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const sendVerificationEmail = async (emailId: string, emailDomain: string): Promise<void> => {
    const fullEmail = `${emailId}@${emailDomain}`;
    try {
      const response = await fetch(`${BASE_URL}/send-email`, {
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
      const response = await fetch(`${BASE_URL}/auth-email`, {
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