import { AgeTag, PageInfo, Region, User, File, OperateTime } from "./types";

export interface Type {
    id: string;
    type: string
}

export interface Day {
    id: string;
    "operate-day": string
}

export interface PostBoard {
    id: number;
    title: string;
    description: string;
}

export interface BoardAdminItem {
    createdAt: number[];
    updatedAt: number[];
    id: number;
    title: string;
    img: string;
    description: string;
}

export interface BoardAdminInfo {
    pageInfo: PageInfo;
    pageList: BoardAdminItem[];
    region: null | Region;
    "age-tag": null | AgeTag;
}

export interface HospitalAdminItem {
    id: null | number;
    name: string;
    address: string;
    "new-address": string;
    phone: string;
    type: string;
    region: Region;
    "operate-time": OperateTime[];
}

export interface HospitalAdminInfo {
    pageInfo: PageInfo;
    pageList: HospitalAdminItem[];
    region: null | Region;
    "age-tag": null | AgeTag;
}

export interface QnaAdminItem {
    id: number;
    title: string;
    secret: boolean;
    questionCheck: boolean;
    users: User;
}

export interface QnaAdminList {
    data: QnaAdminItem;
    files: File[];
}

export interface QnaAdminInfo {
    'pageInfo': PageInfo;
    'pageList': QnaAdminList[];
    region: null | Region;
    "age-tag": null | AgeTag;
}

export interface QnaAnswer {
    id: number;
    answer: string;
}

export interface ClassSubmitItem {
    id: number | null;
    name: string;
    address: string;
    'new-address': string;
    phone: string;
    region: Region;
    "operate-time": OperateTime[];
  }