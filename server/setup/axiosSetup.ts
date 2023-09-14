import axios, { AxiosError } from 'axios';
import { CONNECTION_STRING, IOT_ENDPOINT } from '../config';
import { CONTENT_TYPE } from '../constants';
import CustomError from '../utils/CustomError';

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? CONNECTION_STRING : IOT_ENDPOINT,
  headers: {
    'Content-Type': CONTENT_TYPE,
  },
});

export const axiosCall = async <T>(
  method: 'get' | 'post',
  url: string,
  data?: any,
  headers?: any,
): Promise<T> => {
  try {
    const response = await axiosInstance[method]<T>(url, data, { headers });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw handleAxiosError(error);
    }
    console.error('Unknown error:', error);
    throw new Error('An unknown error occurred');
  }
};

const handleAxiosError = (error: AxiosError): CustomError => {
  return new CustomError(error.message, error.response?.data);
};

export default axiosInstance;
