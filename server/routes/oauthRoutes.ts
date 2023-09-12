import express from 'express';
import * as iotController from '../controllers/iotController';

const router = express.Router();

router.post('/access_token', async (req, res) => {
  try {
    const { grant_type, refresh_token } = req.query;

    if (grant_type !== 'refresh_token' || !refresh_token) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const newAccessToken = await iotController.refreshAccessToken(
      String(refresh_token),
    );

    if (newAccessToken) {
      return res.status(200).json({ access_token: newAccessToken });
    } else {
      return res.status(401).json({ error: 'Failed to refresh token' });
    }
  } catch (error) {
    console.error(`Error refreshing token: ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
