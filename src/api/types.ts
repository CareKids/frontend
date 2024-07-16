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

interface DevDomain {
  devDomainId: number;
  devDomainType: string;
}

interface User {
  id: number;
  nickname: string;
}

interface File {
  fileName: string;
  fileSaveName: string;
  "file-path": string;
}

export interface ApiError {
  status: number;
  message: string;
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

export interface PolicyItem {
  id: number;
  title: string;
  description: string;
  createdAt: number[];
  updatedAt: number[];
  region: Region;
  "age-tag": AgeTag;
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

export interface QnAItem {
  createdAt: number[];
  updatedAt: number[];
  id: number;
  title: string;
  secret: boolean;
  questionCheck: boolean;
  users: User;
}

export interface QnASubmitItem {
  title: string;
  secret: boolean;
  text: string;
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
  "age-tag": null | AgeTag;
}

export interface ClassInfo {
  pageInfo: PageInfo;
  pageList: ClassItem[];
  region: Region;
  "age-tag": null | AgeTag;
}

export interface PlayBoardInfo {
  pageInfo: PageInfo;
  pageList: PlayItem[];
  region: null | Region;
  "age-tag": null | AgeTag;
}

export interface PolicyBoardInfo {
  pageInfo: PageInfo;
  pageList: PolicyItem[];
  region: Region;
  'age-tag': AgeTag;
}

export interface QnAInfo {
  'pageInfo': PageInfo;
  'pageList': QnAItem[];
  region: null | Region;
  "age-tag": null | AgeTag;
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

export interface DetailPlayItem {
  id: number;
  title: string;
  text: string;
  tools: string;
  "recommend-age": string;
  "age-tag": AgeTag;
  "dev-domains": DevDomain[];
}

export interface DetailPolicyItem {
  id: number;
  title: string;
  text: string;
  target: string;
  process: string;
  url: string;
  region: Region[];
  "age-tag": AgeTag[];
}

export interface DetailQnAItem {
  id: number;
  title: string;
  text: string;
  secret: boolean;
  author: User;
  check: boolean;
  answer: null | string;
}

export interface DetailQnaInfo {
  data: DetailQnAItem;
  files: File[];
}

// 검색 interface
export interface HospitalSearch {
  query: string | null;
  region: Region | {};
}

export interface PlaySearch {
  query: string | null;
  "age-tag": AgeTag | {};
}

export interface PolicySearch {
  query: string | null;
  region: Region | {};
  "age-tag": AgeTag | {};
}