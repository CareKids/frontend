// 기본 interface
export interface Region {
  id: number;
  name: string;
}

export interface AgeTag {
  id: number;
  name: string;
}

interface OperateTime {
  startTime: [number, number];
  endTime: [number, number];
  "operation-day": string;
}


// 회원가입 interface
export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  socialType: 'GOOGLE' | 'NAVER' | '';
  region: Region;
  ageTags: AgeTag[];
}

export interface SignInInfo {
  'region': Region[];
  'age-tag': AgeTag[];
}

// 로그인 interface
export interface LoginData {
  email: string;
  password: string;
}

export interface UserInfo {
  usersId: number;
  usersEmail: string;
  usersNickname: string;
  usersRegion: Region;
  usersAgeTagDtos: AgeTag[];
}

// 게시판 정보 interface 
export interface PageInfo {
  total: number;
  page: number;
  size: number;
}

export interface PlayItem {
  id: number;
  title: string;
  description: string;
  createdAt: number[];
  updatedAt: number[];
}

export interface HospitalItem {
  id: number;
  name: string;
  address: string;
  "new-address": string;
  phone: string;
  type: string;
  region: Region;
  "operate-time": OperateTime[];
}

export interface ClassItem {
  kindergartenId: number;
  kindergartenName: string;
  kindergartenAddress: string;
  kindergartenNewaddress: string;
  kindergartenPhone: string;
  kindergartenRegion: Region;
  "operate-time": OperateTime[];
}

export interface BoardItem {
  createdAt: number[];
  updatedAt: number[];
  id: number;
  title: string;
}

// 홈 화면 interface
export interface PlayInfo {
  'play-info': PlayItem[];
  'age-tag': AgeTag;
}

export interface PolicyInfo {
  region: Region[];
  'age-tag': AgeTag;
  'kids-policy': any[];
}

export interface HomeInfo {
  'kids-policy': PolicyInfo;
  'play-info': PlayInfo;
}

// 게시판 API interface
export interface BoardInfo {
  'pageInfo': PageInfo;
  'pageList': BoardItem[];
}

export interface HospitalInfo {
  pageInfo: PageInfo;
  pageList: HospitalItem[];
  region: Region;
  "age-tag": null | { id: number; name: string };
}

export interface ClassInfo {
  pageInfo: PageInfo;
  pageList: ClassItem[];
  region: Region;
  "age-tag": null | { id: number; name: string };
}

// 상세페이지 interface
export interface BoardDetail {
  createdAt: number[];
  updatedAt: number[];
  id: number;
  title: string;
  img: string;
  description: string;
}


// 검색 interface
export interface HospitalSearch {
  query: string | null;
  region: Region | {};
}