export type TSelectSeatByBooking = {
  userId: string;
  createdAt: Date;
  selectedTime: Date;
  expireTime: Date;
};

export type TSeatingByBooking = {
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

export type TSelectSeatingByUser = {
  restaurantId: string;
  seatId: string;
  dateTime: Date; //2024-11-22T21:30:00
};
