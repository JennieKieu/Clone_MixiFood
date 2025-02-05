import { TSelectSeatingByUser } from '../models/UserModel';
import { client } from './client';
import { TUserCreateSeatingBooking } from './user.api.types';

const BASE_URL = '/users';

class UserApi {
  constructor() { }

  //
  async getRestaurant(restaurantId: string) {
    const url = `${BASE_URL}/restaurant/${restaurantId}`;
    return client.getCient().get(url);
  }

  // get seatings by restaurantId
  async getSeatingsByRestaurantId(restaurantId: string) {
    const url = `${BASE_URL}/seating/${restaurantId}`;
    return client.getCient().get(url);
  }

  // active map
  async verifyMap() {
    const url = `${BASE_URL}/Verify/map`;
    return client.getCient().get(url);
  }

  // select seating when booking
  async selectSeatingOnBooking(data: TSelectSeatingByUser) {
    const url = `${BASE_URL}/selectSeating`;
    return client.getCient().post(url, data);
  }

  // seating booking
  // create require booking
  async createUserSeatingBooking(data: TUserCreateSeatingBooking) {
    const url = `${BASE_URL}/booking`;
    return client.getCient().post(url, data)
  }
}

export const userApi = new UserApi();
