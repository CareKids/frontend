import { HomeInfo, SignInInfo, BoardInfo, BoardDetail, Region, AgeTag } from './types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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

export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await fetch(`${BASE_URL}/region`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    const data: Region[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getAgeTags = async (): Promise<AgeTag[]> => {
  try {
    const response = await fetch(`${BASE_URL}/age-tag`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    const data: AgeTag[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// export const getHospitalData = async (page: number, size: number): Promise<HospitalInfo> => {
//   try {
//     const response = await fetch(`${BASE_URL}/notice?page=${page}&size=${size}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       mode: 'cors',
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: BoardInfo = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching home info:', error);
//     throw error;
//   }
// };

export const getBoardData = async (page: number, size: number): Promise<BoardInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/notice?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BoardInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home info:', error);
    throw error;
  }
};

export const getBoardDetailData = async (id: string): Promise<BoardDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/notice/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BoardDetail = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching board detail:', error);
    throw error;
  }
};