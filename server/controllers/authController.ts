import axios from 'axios';
import { IOT_ENDPOINT } from '../config';
import { CONTENT_TYPE_CHARSET } from '../constants';
import { base64Credentials } from '../utils/auth.utils';

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
  };

  const formData = new URLSearchParams(payload).toString();

  try {
    const response = await axios.post(
      `${IOT_ENDPOINT}/oauth2/access_token`,
      formData,
      {
        headers: {
          'Content-Type': `${CONTENT_TYPE_CHARSET}`,
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
    if (error.response) {
      console.log('Response Error:', error.response.status);
      console.log('Response Data:', error.response.data);
    } else if (error.request) {
      console.log('Request Error:', error.request);
    } else {
      console.log('Setup Error:', error.message);
    }
    console.log('Config that triggered the error:', error.config);

    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};
