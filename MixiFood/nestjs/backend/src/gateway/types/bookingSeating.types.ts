export type TSelectSeatByBooking = {
  userId: string;
  createdAt: Date;
  selectedTime: Date;
  expireTime: Date;
};

export type TUserSelectSeating = {
  _id: string;
  seatName: string;
  maxOfPeople: number;
  isBooking: boolean;
  restaurantId: string;
  isServing: boolean;
  currentOrderId: string;
  bookingTime: Date[];
  isSelectByBooking: TSelectSeatByBooking[];
};
