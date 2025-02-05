import {TPaymentMethods} from '../api/api.types';
import {TOrderItem} from './order';

export type TInvoiceStatus = 'pending' | 'cancel' | 'success';
export type TInvoiceOrderItem = TOrderItem & {
  price: number;
  unitPrice: number;
};

export type TInvoice = {
  restaurantId: string;
  employeeId: string;
  createdAt: Date;
  status: TInvoiceStatus;
  seatId: string;
  paymentMethod: TPaymentMethods;
  orderId: string;
  userPhoneNumber?: string;
  vnpayUrl?: string;
};

export type TInvoiceForStore = {
  _id: string;
  restaurantId: string;
  employeeId: string;
  orderId: string;
  seatId: string;
  status: TInvoiceStatus;
  paymentMethod: TPaymentMethods;
  createdAt: Date;
  employeeName: string;
  seatName: string;
  employeeAvatar: string;
  totalPrice: number;
  orderItems: TInvoiceOrderItem[];
  vnpayUrl?: string;
};
