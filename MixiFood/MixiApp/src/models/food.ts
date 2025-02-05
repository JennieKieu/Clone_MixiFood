export type TFood = {
  _id: string;
  name: string;
  unit: string;
  foodImage: string;
  isRemoveBg: boolean;
  available: boolean;
  price: string;
  isDelete: boolean;
  quantity?: number;
};

export type TFoodForStore = {
  _id: string;
  name: string;
  unit: string;
  foodImage: string;
  isRemoveBg: boolean;
  available: boolean;
  price: string;
  isDelete: boolean;
  quantity?: number;
};
