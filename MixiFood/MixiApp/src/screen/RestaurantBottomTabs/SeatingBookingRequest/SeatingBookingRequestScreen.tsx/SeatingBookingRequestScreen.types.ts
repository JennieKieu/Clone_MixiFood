import {ESeatingBookingStatus} from '../../../../api/api.types';

export type TSeatingBookingRequest = {
  _id: string;
  createdAt: Date;
  contactPhoneNumber: string;
  numberOfPeople: number;
  status: ESeatingBookingStatus;
  bookingExpiresAt: Date;
  bookingTime: Date;
  seatingName: string;
};
