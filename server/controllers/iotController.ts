import {
  CLIENT_ID_KEY,
  CLIENT_SECRET_KEY,
  GRANT_TYPE,
  PASSWORD_TYPE,
} from '../constants';
import { axiosCall } from '../setup/axiosSetup';
import {
  AccessTokenParamsPassword,
  AccessTokenParamsRefresh,
  DevicesResponse,
  GatewayClientsResponse,
  OAuth2Token,
} from '../types/iot/iotDevices';

export const getAccessTokenWithPassword = async ({
  grantType,
  username,
  password,
  passwordType,
  clientId,
  clientSecret,
}: AccessTokenParamsPassword): Promise<OAuth2Token> => {
  const url = `/oauth2/access_token`;
  const postData: Record<string, string> = {
    [GRANT_TYPE]: grantType,
    username,
    password,
    [PASSWORD_TYPE]: passwordType,
    [CLIENT_ID_KEY]: clientId,
    [CLIENT_SECRET_KEY]: clientSecret,
  };

  const formData = new URLSearchParams(postData).toString();

  return await axiosCall<OAuth2Token>('post', url, formData);
};

export const getDeviceGatewayClients = async (
  accessToken: string,
  deviceId: string,
): Promise<GatewayClientsResponse> => {
  const url = `/api/devices/${deviceId}/gateway/clients`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  return await axiosCall<GatewayClientsResponse>(
    'get',
    url,
    undefined,
    headers,
  );
};

export const getDevices = async (
  accessToken: string,
): Promise<DevicesResponse> => {
  const url = `/api/devices`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  return await axiosCall<DevicesResponse>('get', url, undefined, headers);
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

  const payload = new URLSearchParams(postData).toString();

  return await axiosCall<OAuth2Token | null>(
    'post',
    '/oauth2/access_token',
    payload,
  );
};
