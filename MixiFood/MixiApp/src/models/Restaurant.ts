import {ERestaurantPayment, EUserType} from '../store';

export type TRestaurantPaymentMethods = {
  _id: string;
  paymentMethodId: string;
  paymentMethodName: ERestaurantPayment;
};

export type TRestaurantInfo = {
  _id: string;
  restaurantName: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  coverImage: string;
  restaurantAddress: string;
  role: EUserType;
  locationId?: string;
  paymentMethods?: TRestaurantPaymentMethods[];
};
