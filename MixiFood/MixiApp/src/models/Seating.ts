import {ESeatingBookingStatus} from '../api/api.types';
import { ESeatingStatus } from '../screen/EmployeeBottomTabs/Home/HomeScreen.types';
import {TOrderedFood} from './order';

export type TSeating = {
  seatName: string;
  maxOfPeople: number;
};

export type TSeatingForStore = {
  _id: string;
  seatName: string;
  maxOfPeople: number;
  currentOrderId?: string;
  currentOrder?: TOrderedFood[];
  status: ESeatingStatus;
};
