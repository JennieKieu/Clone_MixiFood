import {Asset} from 'react-native-image-picker';
import {
  TAccount,
  TRegisterRestaurant,
  TRegisterUser,
  TSendSmsOtp,
  TVerifySmsOtp,
} from './api.types';
import {client} from './client';
import {TUploadProfileType} from '../screen/RestaurantBottomTabs/ConfirmSaveAvatarScreen';

const BASE_URL = '/auth';

class LoginApi {
  constructor() {}

  async login(account: TAccount) {
    const url = `${BASE_URL}/login`;
    return client.getCient().post(url, account);
  }

  async checkToken() {
    try {
      const response = await this.me();
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async register_User(data: TRegisterUser) {
    const url = `${BASE_URL}/register-user`;
    return client.getCient().post(url, data);
  }

  async register_restaurant(data: TRegisterRestaurant) {
    const url = `${BASE_URL}/register-restaurant`;
    return client.getCient().post(url, data);
  }

  async sendSmsOtp(data: TSendSmsOtp) {
    const url = `${BASE_URL}/smsOtp`;
    return client.getCient().post(url, data);
  }

  async verifySmsOtp(data: TVerifySmsOtp) {
    const url = `${BASE_URL}/verifyOtp`;
    return client.getCient().post(url, data);
  }

  async me() {
    const url = `${BASE_URL}/me`;
    return client.getCient().get(url);
  }

  // upload avatar
  async uploadAvatar(file: Asset) {
    const url = `${BASE_URL}/uploadAvatar`;

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.fileName || 'avatar.jpg',
      type: file.type || 'image/jpeg',
    });

    return client.getCient().post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // upload cover image
  async uploadCoverImage(file: Asset) {
    const url = `${BASE_URL}/uploadCoverImage`;

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.fileName || 'avatar.jpg',
      type: file.type || 'image/jpeg',
    });

    return client.getCient().post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const loginApi = new LoginApi();
