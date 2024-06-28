import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState',
  default: true,
});

export const userRoleState = atom({
  key: 'userRoleState',
  default: 'admin', // 일반사용자: user, 관리자: admin
});