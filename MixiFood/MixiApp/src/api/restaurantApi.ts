import {Asset} from 'react-native-image-picker';
import {TEmployee, TSeating} from '../models';
import {
  ESeatingBookingStatus,
  TCreateEmployee,
  TCreateFood,
  TCreateVnPayment,
  TEditEmployee,
  TEditFood,
  TFilterDefault,
  TSetLocation,
} from './api.types';
import {client} from './client';
import {TFood} from '../models/food';

const BASE_URL = '/restaurant';

class RestaurantApi {
  constructor() {}

  // Employee
  async getAllEmployee(restaurantId: string) {
    const url = `${BASE_URL}/${restaurantId}/employee`;
    return client.getCient().get(url);
  }

  // create employee
  async createEmployee(restaurantId: string, data: TCreateEmployee) {
    const url = `${BASE_URL}/${restaurantId}/employee`;
    return client.getCient().post(url, data);
  }

  // Delete employee
  async deleteEmployee(restaurantId: string, employeeIds: TEmployee['_id'][]) {
    const url = `${BASE_URL}/${restaurantId}/employee`;
    return client.getCient().delete(url, {
      data: {
        employeeIds,
      },
    });
  }

  // edit employee
  async editEmployee(data: TEditEmployee, employeeId: string) {
    const url = `${BASE_URL}/employee/edit/${employeeId}`;

    return client.getCient().post(url, data);
  }

  // End Employee

  // Food
  // get all food
  async getAllFood() {
    const url = `${BASE_URL}/food`;
    return client.getCient().get(url);
  }
  // createFood
  async createFood(file: Asset, data: TCreateFood) {
    const url = `${BASE_URL}/createFood`;

    const formData = new FormData();

    formData.append('file', {
      uri: file.uri,
      name: file.fileName || 'avatar.jpg',
      type: file.type || 'image/jpeg',
    });
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('unit', data.unit);
    if (data.isRemoveBg !== undefined) {
      formData.append('isRemoveBg', data.isRemoveBg);
    }

    return client.getCient().post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // delete foods
  async deleteFoods(data: TFood['_id'][]) {
    const url = `${BASE_URL}/food`;
    return client.getCient().delete(url, {
      data: {
        foodIds: data,
      },
    });
  }

  // updateFood
  async updateFood(data: TEditFood, file?: Asset) {
    const url = `${BASE_URL}/food/edit`;

    const formData = new FormData();

    if (file) {
      formData.append('file', {
        uri: file.uri,
        name: file.fileName || 'avatar.jpg',
        type: file.type || 'image/jpeg',
      });
    }
    formData.append('foodId', data._id);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('unit', data.unit);
    if (data.isRemoveBg !== undefined) {
      formData.append('isRemoveBg', data.isRemoveBg);
    }

    // console.log('form data', formData);

    return client.getCient().post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // get all seat
  async getAllSeat() {
    const url = `${BASE_URL}/seats`;
    return client.getCient().get(url);
  }

  // create multi seat
  async createMultiSeats(seatNumber: number) {
    const url = `${BASE_URL}/seats`;
    const data = {numberOfSeats: seatNumber};
    return client.getCient().post(url, data);
  }

  // create one seat
  async createOneSeat(data: TSeating) {
    const url = `${BASE_URL}/seat`;
    return client.getCient().post(url, data);
  }

  // invoice
  // pending invoice
  async getPendingInvoices() {
    const url = `${BASE_URL}/invoices-pending`;
    return client.getCient().get(url);
  }
  // confirm cash payment
  async confirmCashPayment(data: {invoiceId: string}) {
    const url = `${BASE_URL}/confirmCashPayment`;
    return client.getCient().post(url, data);
  }

  // get invoice infomation by invoiceId
  async getInvoiceInfomation(invoiceId: string) {
    const url = `${BASE_URL}/invoice/${invoiceId}`;
    return client.getCient().get(url);
  }

  // update fcm token
  async updateFcmToken(fcmToken: string) {
    const url = `${BASE_URL}/fcmToken`;
    return client.getCient().post(url, {fcmToken: fcmToken});
  }

  // get invoices
  async getInvoices(
    filter: TFilterDefault = 'DAY',
    limit?: number,
    offset?: number,
    specificDate?: Date,
  ) {
    const filterDay =
      (specificDate &&
        `&specificDate=${specificDate.toLocaleDateString('en-CA')}`) ||
      '';
    // console.log('fllDate', filterDay);

    const fill =
      (limit && offset && `?limit=${limit}&offset=${offset}`) ||
      `?limit=50&offset=0`;
    const url = `${BASE_URL}/invoicies/${filter}${fill}${filterDay}`;
    return client.getCient().get(url);
  }

  // get number invoices to day
  async getNumberInvoicesToDay() {
    const url = `${BASE_URL}/numberOfInvoices`;
    return client.getCient().get(url);
  }

  // set location
  async setLocation(direction: TSetLocation) {
    const url = `${BASE_URL}/location/register`;
    return client.getCient().post(url, {direction: direction});
  }

  // payment
  // create vnpay ment
  async createVnPayment(data: TCreateVnPayment) {
    const url = `${BASE_URL}/add_payment/vnpay`;
    return client.getCient().post(url, data);
  }

  // booking
  // get pendingBooking
  async getRequestSeatingBooking(status?: ESeatingBookingStatus) {
    const query = status ? `?status=${status}` : '';
    const url = `${BASE_URL}/booking/requests${query}`;
    return client.getCient().get(url);
  }
}

export const restaurantApi = new RestaurantApi();
