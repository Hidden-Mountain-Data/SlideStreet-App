import axios from 'axios';
import { IOT_ENDPOINT } from '../config';
import { CONTENT_TYPE } from '../constants';

const axiosInstance = axios.create({
  baseURL: IOT_ENDPOINT,
  headers: {
    'Content-Type': CONTENT_TYPE,
  },
});

export default axiosInstance;
