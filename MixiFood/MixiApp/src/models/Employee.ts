import {ERestaurantRole} from '../api/api.types';
import {EEmployeeRole} from '../screen/Employee/EmployeeScreen.types';
import {EUserType} from '../store';

export type TEmployee = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  isFullTime: boolean;
  role: EUserType;
  restaurantRole: EEmployeeRole;
  avatar: string;
  coverImage: string;
  gender?: string;
};

export type TEmployeeForStore = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  restaurant: string;
  isFullTime: boolean;
  email?: string;
  avatar: string;
  coverImage: string;
  role: EUserType;
  restaurantRole: ERestaurantRole;
};
