import {CreateAxiosDefaults} from 'axios';
import {BASE_URL} from '../constants';

const config: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {},
};
