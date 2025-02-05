export type TUserCreateSeatingBooking = {
  restaurantId: string;
  numberOfAdults: number;
  numberOfChildren: number;
  bookingTime: Date;
  seatingId: string;
  notes?: string;
};
