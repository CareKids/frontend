export interface Region {
  id: number;
  name: string;
}

export interface AgeTag {
  id: number;
  name: string;
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