import axios, {Axios, AxiosError, AxiosInstance} from 'axios';
import {BASE_URL} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import queryString from 'query-string';

class Client {
  private _axiosClient;
  constructor() {
    this._axiosClient = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: params => queryString.stringify(params),
    });

    this._axiosClient.interceptors.request.use(async config => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // console.log(token);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // console.log('fail login');
      }

      return config;
    });

    this._axiosClient.interceptors.response.use(
      reponse => {
        if (reponse && reponse.data) {
          const {code, auto} = reponse.data;
          console.log(reponse.data);
          if (code === 401) {
            if (auto === 'yes') {
              return this.refreshToken().then(async response => {
                const {token} = reponse.data;
                await AsyncStorage.setItem('token', token);

                const config = reponse.config;
                config.headers['x-access-token'] = token;
                config.baseURL = BASE_URL;
                return this._axiosClient(config);
              });
            }
          }
          return reponse.data;
        }
        return reponse;
      },
      // async (error: AxiosError) => {
      //   const originalRequest = error.config;
      //   if (error.response) {
      //     console.log('Reponse data: ', error.response.data);
      //     console.log('Status code: ', error.response.status);
      //   } else if (error.request) {
      //     console.log(
      //       'Request was made but no response received:',
      //       error.request,
      //     );
      //   } else console.log('Error', error.message);
      // },
    );
  }

  async refreshToken() {
    console.log('wor1k');

    const refreshToken = await AsyncStorage.getItem('refreshToken');
    return (
      this._axiosClient.post('/auth/refresh-token'),
      {
        refreshToken,
      }
    );
  }

  getCient() {
    return this._axiosClient;
  }
}

export const client = new Client();
