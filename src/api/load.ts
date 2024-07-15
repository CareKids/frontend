import { HomeInfo, SignInInfo, BoardInfo, BoardDetail, Region, AgeTag, UserInfo, HospitalInfo, HospitalSearch, ClassInfo, PlayBoardInfo, PlaySearch, PlayItem, DetailPlayItem } from './types';

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
    console.error('Error fetching signin info:', error);
    throw error;
  }
};

export const getUserInfo = async (): Promise<UserInfo> => {  
  try {
    const response = await fetch(`${BASE_URL}/user-detail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserInfo = await response.json();
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

export const getClassData = async (page: number, size: number): Promise<ClassInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/kindergarten?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ClassInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching kindergarten info:', error);
    throw error;
  }
};

export const filterClassData = async (params: HospitalSearch, page: number): Promise<ClassInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/kindergarten/search?page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.query,
        region: params.region
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching and filtering kindergartens:', error);
    throw error;
  }
};

export const getHospitalData = async (page: number, size: number): Promise<HospitalInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/hospital?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HospitalInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hospital info:', error);
    throw error;
  }
};

export const filterHospitalData = async (params: HospitalSearch, page: number): Promise<HospitalInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/hospital/search?page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.query,
        region: params.region
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching and filtering hospitals:', error);
    throw error;
  }
};

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
    return data;
  } catch (error) {
    console.error('Error fetching board detail:', error);
    throw error;
  }
};

export const getPlayData = async (page: number, size: number): Promise<PlayBoardInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/playinfo?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PlayBoardInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home info:', error);
    throw error;
  }
};

export const filterPlayData = async (params: PlaySearch, page: number): Promise<PlayBoardInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/playinfo/search?page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.query,
        "age-tag": params['age-tag']
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching and filtering hospitals:', error);
    throw error;
  }
};

export const getPlayDetailData = async (id: string): Promise<DetailPlayItem> => {
  try {
    const response = await fetch(`${BASE_URL}/playinfo/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DetailPlayItem = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching play detail:', error);
    throw error;
  }
};