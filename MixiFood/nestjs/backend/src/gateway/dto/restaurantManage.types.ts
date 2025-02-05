export type TFood = {
  _id: string;
  name: string;
  unit: string;
  foodImage: string;
  isRemoveBg: boolean;
  available: boolean;
  price: string;
  quantity?: number;
  restaurantId: string;
};

export type TOrderedFoodStatus = 'pending' | 'serve' | 'complete' | 'cancel';

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
};
