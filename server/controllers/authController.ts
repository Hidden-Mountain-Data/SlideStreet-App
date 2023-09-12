import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, IOT_ENDPOINT } from '../config';

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const makeLoginRequest = async (
  username: string,
  password: string,
): Promise<AuthTokens> => {
  const payload = {
    username,
    password,
    grant_type: 'password',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET!,
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

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    return {
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error('Error Details:', {});

    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};
