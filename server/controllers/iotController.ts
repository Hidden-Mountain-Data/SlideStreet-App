import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, IOT_ENDPOINT } from '../config';
import { DevicesResponse } from '../types/iot/iotDevices';

export const getDeviceGatewayClients = async (
  accessToken: string,
  deviceId: string,
): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const url = `${IOT_ENDPOINT}/api/devices/${deviceId}/gateway/clients`;

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    console.error('Something went wrong:', error);
    throw error;
  }
};

export const getDevices = async (
  accessToken: string,
): Promise<DevicesResponse> => {
  try {
    const response = await axios.get<DevicesResponse>(
      `${IOT_ENDPOINT}/api/devices`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Could not fetch devices:', error);
    throw new Error('Failed to fetch devices');
  }
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<string | null> => {
  const payload = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  const formData = new URLSearchParams(payload).toString();

  const base64Credentials = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`,
  ).toString('base64');

  try {
    const response = await axios.post(
      `${IOT_ENDPOINT}/oauth2/access_token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          Authorization: `Basic ${base64Credentials}`,
        },
      },
    );

    if (response.data && response.data.access_token) {
      return response.data.access_token;
    }
    return null;
  } catch (error: any) {
    console.error('Refresh token failed:', error);
    return null;
  }
};
