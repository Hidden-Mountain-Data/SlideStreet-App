import express, { Request, Response } from 'express';
import * as iotController from '../../controllers/iotController';

const router = express.Router();

interface OAuthQueryParams {
  grant_type?: string;
  refresh_token?: string;
  username?: string;
  password?: string;
  password_type?: string;
  client_id?: string;
  client_secret?: string;
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const { client_id, client_secret, refresh_token }: OAuthQueryParams =
    req.query;
  if (!client_id || !client_secret) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const newAccessToken = await iotController.refreshAccessToken({
    clientId: String(client_id),
    clientSecret: String(client_secret),
    grantType: 'refresh_token',
    refreshToken: String(refresh_token),
  });

  if (newAccessToken) {
    return res.status(200).json(newAccessToken);
  }
  return res.status(401).json({ error: 'Failed to refresh token' });
};

const handleRefreshTokenByPassword = async (req: Request, res: Response) => {
  const { username, password, password_type, client_id, client_secret } =
    req.query;
  if (
    !username ||
    !password ||
    !password_type ||
    !client_id ||
    !client_secret
  ) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const data = await iotController.getAccessTokenWithPassword({
    grantType: 'password',
    username: String(username),
    password: String(password),
    passwordType: String(password_type),
    clientId: String(client_id),
    clientSecret: String(client_secret),
  });

  if (data) {
    return res.status(200).json(data);
  }
  return res.status(401).json({ error: 'Failed to obtain access token' });
};

router.post('/access_token', async (req, res) => {
  const { grant_type }: OAuthQueryParams = req.query;

  if (!grant_type) {
    return res.status(400).json({ error: 'Missing grant_type' });
  }

  if (grant_type === 'refresh_token') {
    return handleRefreshToken(req, res);
  }
  if (grant_type === 'password') {
    return handleRefreshTokenByPassword(req, res);
  }

  return res.status(400).json({ error: 'Invalid grant_type' });
});

export default router;
