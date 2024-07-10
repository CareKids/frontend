import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState',
  default: false,
});

export const userRoleState = atom({
  key: 'userRoleState',
  default: 'user', // 일반사용자: user, 관리자: admin
});