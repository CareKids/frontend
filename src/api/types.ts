export interface Region {
  id: number;
  name: string;
}

export interface AgeTag {
  id: number;
  name: string;
}

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  socialType: 'GOOGLE' | 'NAVER' | '';
  region: Region;
  ageTags: AgeTag[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PolicyInfo {
  region: Region[];
  'age-tag': AgeTag;
  'kids-policy': any[];
}

export interface PlayItem {
  id: number;
  title: string;
  description: string;
  createdAt: number[];
  updatedAt: number[];
}

export interface PageInfo {
  total: number;
  page: number;
  size: number;
}

export interface BoardItem {
  createdAt: number[];
  updatedAt: number[];
  id: number;
  title: string;
}

export interface BoardDetail {
  createdAt: number[];
  updatedAt: number[];
  id: number;
  title: string;
  img: string;
  description: string;
}

export interface PlayInfo {
  'play-info': PlayItem[];
  'age-tag': AgeTag;
}

export interface HomeInfo {
  'kids-policy': PolicyInfo;
  'play-info': PlayInfo;
}

export interface SignInInfo {
  'region': Region[];
  'age-tag': AgeTag[];
}

export interface BoardInfo {
  'pageInfo': PageInfo;
  'pageList': BoardItem[];
}