import {EUserType} from '../store';

export type TUserInfo = {
  _id: string;
  phoneNumber: string;
  email: string;
  userName: string;
  avatar: string;
  coverImage: string;
  role: EUserType;
};
