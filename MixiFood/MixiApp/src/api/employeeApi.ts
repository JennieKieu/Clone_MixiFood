import {TSeatingForStore} from '../models';
import {TFoodByOrder, TOrderFoodBySite} from '../models/order';
import {
  TCreateInvoice,
  TKitchangeFoodItemStatus,
  TKitchenChangeFoodItemsStatus,
  TKitchenChangeMultiOrderItemStatus,
} from './api.types';
import {client} from './client';

const BASE_URL = '/employee';

class EmployeeApi {
  constructor() {}

  //   Seating
  async getAllSeating() {
    const url = `${BASE_URL}/seats`;
    return client.getCient().get(url);
  }

  // get seat
  async getSeat(seatId: TSeatingForStore['_id']) {
    const url = `${BASE_URL}/seat`;
    return client.getCient().post(url, {seatId: seatId});
  }

  //   food
  //get all food
  async getAllFood() {
    const url = `${BASE_URL}/foods`;
    return client.getCient().get(url);
  }

  // Order
  // get order status not complete
  async getOrderByStatusServing() {
    const url = `${BASE_URL}/orders`;
    return client.getCient().get(url);
  }

  // order on seat
  async orderFoodOnSite(data: TOrderFoodBySite) {
    // console.log('daa', data);
    const url = `${BASE_URL}/order`;
    return client.getCient().post(url, data);
  }

  // Next order
  async nextOrder(data: TOrderFoodBySite) {
    const url = `${BASE_URL}/nextOrder`;
    return client.getCient().post(url, data);
  }

  // get foods order by seatId
  async getFoodOrderBySeat(seatId: TSeatingForStore['_id']) {
    const url = `${BASE_URL}/getSeatOrder`;
    return client.getCient().post(url, {seatId: seatId});
  }

  // get order by seatId
  async getOrderBySeatId(seatId: string) {
    const url = `${BASE_URL}/seatByOrder/${seatId}`;
    return client.getCient().get(url);
  }

  // get all pedingfoodsItem for kitchen role
  async getPendingFoodItems() {
    const url = `${BASE_URL}/pendingFoods`;
    return client.getCient().get(url);
  }

  // kitchen change status foodItems
  async kitchenChangeFoodItemStatus(data: TKitchenChangeFoodItemsStatus) {
    const url = `${BASE_URL}/orderItem_status`;
    return client.getCient().post(url, data);
  }

  // kitchen change multi orderItem status
  async kitchenChangeMultiOrderItemStatus(
    data: TKitchenChangeMultiOrderItemStatus[],
    status: TKitchangeFoodItemStatus,
  ) {
    const dataWithoutStatus = data.map(item => {
      const {status, ...itemWithoutStatus} = item; // Destructure and omit 'status'
      return {
        ...itemWithoutStatus,
        pendingOrders: item.orderItemId,
      };
    });

    const rqdata = dataWithoutStatus.map(item => ({
      ...item,
      status: status,
    }));

    const url = `${BASE_URL}/change-status-multiple`;
    return client.getCient().post(url, rqdata);
  }

  // serve change food item status
  async serveChangeFoodItemStatus(data: TKitchenChangeFoodItemsStatus) {
    const url = `${BASE_URL}/orderItem-serve`;
    return client.getCient().post(url, data);
  }

  // Invoice
  // createInvoice
  async createInvoice(data: TCreateInvoice) {
    const url = `${BASE_URL}/invoice`;
    return client.getCient().post(url, data);
  }
}

export const employeeApi = new EmployeeApi();
