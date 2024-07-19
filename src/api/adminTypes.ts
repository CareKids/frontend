import { AgeTag, PageInfo, Region, User, File, OperateTime, SubCate, MainCate, Keyword, DetailPlayItem } from "./types";

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

export interface PolicyType {
    id: string;
    "kids-policy-type": string;
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
    text: string;
    secret: boolean;
    check: boolean;
    author: User;
    answer: string;
    createdAt: number[];
    updatedAt: number[];
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

export interface PlaceAdminItem {
    id: number;
    name: string;
    "img-url": string;
    address: null | string;
    "new-address": null | string;
    phone: string;
    type: string;
    "parking-type": string,
    "is-free": string,
    "operate-time": string,
    region: Region
    subcate: SubCate;
    maincate: MainCate;
    keywords: Keyword[];
}

export interface PlaceAdminInfo {
    'pageInfo': PageInfo;
    'pageList': PlaceAdminItem[];
    region: null | Region;
    "age-tag": null | AgeTag;
}

export interface PlayAdminInfo {
    pageInfo: PageInfo;
    pageList: DetailPlayItem[];
    region: null | Region;
    "age-tag": null | AgeTag;
}

export interface PolicyAdminItem {
    id: number;
    title: string;
    text: string;
    target: string;
    process: string;
    type: string;
    url: string;
    createdAt: number[];
    updatedAt: number[];
    region: Region[];
    "age-tag": AgeTag[];
}

export interface PolicySubmit {
    id: null | number;
    title: string;
    text: string;
    target: string;
    process: string;
    type: string;
    url: string;
    region: Region[];
    "age-tag": AgeTag[];
}

export interface PolicyAdminInfo {
    pageInfo: PageInfo;
    pageList: PolicyAdminItem[];
    region: null | Region;
    "age-tag": null | AgeTag;
  }