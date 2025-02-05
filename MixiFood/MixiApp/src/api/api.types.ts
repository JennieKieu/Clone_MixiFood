import {EEmployeeRole} from '../screen/Employee/EmployeeScreen.types';
import {EUserType} from '../store';

export enum ERestaurantRole {
  'manage' = 'manage',
  'security' = 'security',
  'serve' = 'serve',
  'chef' = 'chef',
  'kitchen' = 'kitchen',
}

export type TPaymentMethods = 'momo' | 'cash' | 'vnpay';

export type TAccount = {
  phoneNumber: string;
  password: string;
  userType: EUserType;
};

export type TRegisterUser = {
  fullName?: string;
  phoneNumber: string;
  email: string;
  userName?: string;
  password: string;
  confirmPassword?: string;
};

export type TRegisterRestaurant = {
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword?: string;
  restaurantAddress: string;
  restaurantName: string;
};

export type TSendSmsOtp = {
  phoneNumber: string;
  userType: EUserType;
};

export type TVerifySmsOtp = {
  phoneNumber: string;
  userType: EUserType;
  smsOtp: string;
};

export type TCreateEmployee = {
  phoneNumber: string;
  fullName: string;
  password: string;
  restaurantRole: EEmployeeRole;
  isFullTime?: boolean;
};

export type TEditEmployee = {
  fullName: string;
  password?: string;
  restaurantRole: EEmployeeRole;
  isFullTime?: boolean;
};

export type TCreateFood = {
  name: string;
  price: string;
  unit: string;
  isRemoveBg?: boolean;
};

export type TEditFood = {
  _id: string;
  available?: boolean;
} & TCreateFood;

export type TKitchangeFoodItemStatus = 'complete' | 'cancel';

export type TKitchenChangeFoodItemsStatus = {
  orderId: string;
  foodItemId: string;
  status: TKitchangeFoodItemStatus;
};

export type TKitchenChangeMultiOrderItemStatus = {
  orderId: string;
  orderItemId: string[];
  status: TKitchangeFoodItemStatus;
};

export type TCreateInvoice = {
  orderId: string;
  paymentMethod: TPaymentMethods;
  userPhoneNumber?: string;
};

export type TFilterDefault = 'DAY' | 'WEEK' | 'MONTH';

export type TSetLocation = {
  longitude: number;
  latitude: number;
  full_address: string;
};

// create vnpayment
export type TCreateVnPayment = {
  tmnCode: string;
  secret: string;
};

// booking
export enum ESeatingBookingStatus {
  'pending' = 'pending',
  'cancel' = 'cancel',
  'confim' = 'confim',
}
