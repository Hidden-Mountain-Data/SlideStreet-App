import axios, { AxiosError } from 'axios';
import { IOT_ENDPOINT } from '../config';
import {
  CLIENT_ID_KEY,
  CLIENT_SECRET_KEY,
  GRANT_TYPE,
  PASSWORD_TYPE,
} from '../constants';
import axiosInstance from '../setup/axiosSetup';
import { DevicesResponse } from '../types/iot/iotDevices';

interface AccessTokenParamsPassword {
  grantType: string;
  username: string;
  password: string;
  passwordType: string;
  clientId: string;
  clientSecret: string;
}

interface AccessTokenParamsRefresh {
  grantType: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface GatewayClient {
  iface: string;
  mac: string;
  ipAddress: string;
  hostname: string;
  ttl: number;
}

interface GatewayClientsResult {
  oid: string;
  count: number;
  clients: GatewayClient[];
  updatedAt: string;
  _id: string;
}

interface GatewayClientsResponse {
  result: GatewayClientsResult;
}

interface OAuth2Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface CustomError extends Error {
  data?: any;
}

const handleAxiosError = (error: AxiosError): CustomError => {
  const customError = new Error(error.message) as CustomError;
  customError.data = error.response?.data;
  return customError;
};

export const getAccessTokenWithPassword = async ({
  grantType,
  username,
  password,
  passwordType,
  clientId,
  clientSecret,
}: AccessTokenParamsPassword): Promise<OAuth2Token> => {
  const url = `${IOT_ENDPOINT}/oauth2/access_token`;
  const postData: Record<string, string> = {
    [GRANT_TYPE]: grantType,
    username,
    password,
    [PASSWORD_TYPE]: passwordType,
    [CLIENT_ID_KEY]: clientId,
    [CLIENT_SECRET_KEY]: clientSecret,
  };

  const formData = new URLSearchParams(postData).toString();

  try {
    const response = await axiosInstance.post('/oauth2/access_token', formData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw handleAxiosError(error);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getDeviceGatewayClients = async (
  accessToken: string,
  deviceId: string,
): Promise<GatewayClientsResponse> => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axiosInstance.get<GatewayClientsResponse>(
      `/api/devices/${deviceId}/gateway/clients`,
      config,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Something went wrong:', error.response?.data);
    }
    throw new Error('Failed to fetch gateway clients');
  }
};

export const getDevices = async (
  accessToken: string,
): Promise<DevicesResponse> => {
  const url = `${IOT_ENDPOINT}/api/devices`;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const response = await axiosInstance.get<DevicesResponse>(url, config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw handleAxiosError(error);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const refreshAccessToken = async ({
  clientId,
  clientSecret,
  grantType,
  refreshToken,
}: AccessTokenParamsRefresh): Promise<OAuth2Token | null> => {
  const postData: Record<string, string> = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
    refresh_token: refreshToken,
  };

  try {
    const response = await axiosInstance.post(
      '/oauth2/access_token',
      new URLSearchParams(postData).toString(),
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw handleAxiosError(error);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
