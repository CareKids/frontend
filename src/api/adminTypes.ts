import { AgeTag, PageInfo, Region, User, File } from "./types";

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