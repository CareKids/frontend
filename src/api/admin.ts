import { BoardAdminInfo } from "./adminTypes";

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