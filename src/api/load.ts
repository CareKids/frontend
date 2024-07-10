import { HomeInfo, SignInInfo } from './types';

const BASE_URL = 'http://localhost:8080/api';

export const getHomeInfo = async (): Promise<HomeInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/home`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HomeInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home info:', error);
    throw error;
  }
};

export const getSigninData = async (email: string, socialType: string): Promise<SignInInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/signup?email=${email}&social-type=${socialType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SignInInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home info:', error);
    throw error;
  }
};