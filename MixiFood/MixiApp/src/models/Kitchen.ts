import {TOrderedFoodStatus} from './order';

export type TFoodPendingForStore = {
  _id: string;
  foodId: string;
  quantity: number;
  status: TOrderedFoodStatus;
  orderTime: Date;
};

export type TPendingOrder = {
  orderId: string;
  pendingFoodItems: TFoodPendingForStore[];
  seatId: string;
};
