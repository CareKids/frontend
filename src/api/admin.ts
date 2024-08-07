import { BoardAdminInfo, QnaAdminInfo, QnaAnswer, HospitalAdminInfo, Day, Type, HospitalAdminItem, ClassSubmitItem, PlaceAdminInfo, PlaceAdminItem, PlayAdminInfo, PolicyAdminInfo, PolicySubmit, PolicyType } from "./adminTypes";
import { ClassInfo, DetailPlayItem, DevDomain } from "./types";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const getBoardAdminData = async (page: number, size: number): Promise<BoardAdminInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/notice?page=${page}&size=${size}`, {
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

    const data: BoardAdminInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin board info:', error);
    throw error;
  }
};

export const postBoardAdminData = async (formData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/notice/edit`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting admin board data:', error);
    throw error;
  }
};

export const deleteBoardAdminData = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/notice/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing admin board data:', error);
    throw error;
  }
};

export const getQnaAdminData = async (page: number, size: number): Promise<QnaAdminInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/question?page=${page}&size=${size}`, {
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

    const data: QnaAdminInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin qna info:', error);
    throw error;
  }
};

export const postQnaAdminData = async (item: QnaAnswer) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/question/edit-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response;
    return data;
  } catch (error) {
    console.error('Error posting admin qna answer:', error);
    throw error;
  }
};

export const getDays = async (): Promise<Day[]> => {
  try {
    const response = await fetch(`${BASE_URL}/operate-day`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    const data: Day[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching days:', error);
    throw error;
  }
};

export const getTypes = async (): Promise<Type[]> => {
  try {
    const response = await fetch(`${BASE_URL}/hospital-type`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    const data: Type[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getHospitalAdminData = async (page: number, size: number): Promise<HospitalAdminInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/hospital?page=${page}&size=${size}`, {
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

    const data: HospitalAdminInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin qna info:', error);
    throw error;
  }
};

export const postHospitalAdminData = async (item: HospitalAdminItem) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/hospital/edit`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting admin hospital data:', error);
    throw error;
  }
};

export const deleteHospitalAdminData = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/hospital/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing admin hospital data:', error);
    throw error;
  }
};

export const getClassAdminData = async (page: number, size: number): Promise<ClassInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/kindergarten?page=${page}&size=${size}`, {
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
    console.error('Error fetching admin class info:', error);
    throw error;
  }
};

export const postClassAdminData = async (item: ClassSubmitItem) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/kindergarten/edit`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting admin class data:', error);
    throw error;
  }
};

export const deleteClassAdminData = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/kindergarten/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing admin class data:', error);
    throw error;
  }
};

export const getPlaceAdminData = async (page: number, size: number): Promise<PlaceAdminInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/place?page=${page}&size=${size}`, {
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

    const data: PlaceAdminInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin place info:', error);
    throw error;
  }
};

export const postPlaceAdminData = async (item: PlaceAdminItem) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/place/edit`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting admin place data:', error);
    throw error;
  }
};

export const deletePlaceAdminData = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/place/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing admin place data:', error);
    throw error;
  }
};

export const getPlayAdminData = async (page: number, size: number): Promise<PlayAdminInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/playinfo?page=${page}&size=${size}`, {
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

    const data: PlayAdminInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin play info:', error);
    throw error;
  }
};

export const postPlayAdminData = async (item: DetailPlayItem) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/playinfo/edit`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting admin play data:', error);
    throw error;
  }
};

export const deletePlayAdminData = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/playinfo/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing admin play data:', error);
    throw error;
  }
};

export const getPolicyAdminData = async (page: number, size: number): Promise<PolicyAdminInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/kids-policy?page=${page}&size=${size}`, {
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

    const data: PolicyAdminInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin policy info:', error);
    throw error;
  }
};

export const postPolicyAdminData = async (item: PolicySubmit) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/kids-policy/edit`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting admin policy data:', error);
    throw error;
  }
};

export const deletePolicyAdminData = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/kids-policy/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing admin policy data:', error);
    throw error;
  }
};

export const getPolicyType = async (): Promise<PolicyType[]> => {
  try {
    const response = await fetch(`${BASE_URL}/kidsPolicy-type`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    const data: PolicyType[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching policy types:', error);
    throw error;
  }
};

export const getDevDomains = async (): Promise<DevDomain[]> => {
  try {
    const response = await fetch(`${BASE_URL}/dev-domain`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    const data: DevDomain[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching policy types:', error);
    throw error;
  }
};