import axios from 'axios';
import {BASE_URL} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshToken() {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  return (
    axiosClient.post('/auth/refresh-token'),
    {
      refreshToken,
    }
  );
}
