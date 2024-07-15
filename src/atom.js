import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState',
  default: false,
});

export const userRoleState = atom({
  key: 'userRoleState',
  default: 'user',
});

export const authLoadingState = atom({
  key: 'authLoadingState',
  default: true,
});