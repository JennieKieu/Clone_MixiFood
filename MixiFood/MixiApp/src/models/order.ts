export type TFoodByOrder = {
  foodId: string;
  quantity: number;
};

export type TOrderFoodBySite = {
  seatId: string;
  foodItems: TFoodByOrder[];
};

export type TOrderedFoodStatus =
  | 'pending'
  | 'serve'
  | 'complete'
  | 'cancel'
  | 'canceling';
export type TOrderStatus = 'serving' | 'complete' | 'payment';

export type TOrderedFood = {
  _id: string;
  foodId: string;
  quantity: number;
  status: TOrderedFoodStatus;
  employeeId: string;
  orderTime: Date;
};

export type TOrder = {
  _id: string;
  employeeId: string;
  foodItems: TOrderItem[];
  seatId: string;
  status: TOrderStatus;
  createdAt: Date;
};

export type TOrderItem = {
  _id: string;
  quantity: number;
  status: TOrderedFoodStatus;
  employeeIds: string;
  orderTime: Date;
  foodId: string;
};
