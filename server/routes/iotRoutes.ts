import express from 'express';
import * as iotController from '../controllers/iotController';
import { CustomSession } from '../types/customSessionTypes';

const router = express.Router();

router.get(`/devices`, async (req, res) => {
  const accessToken = (req.session as CustomSession).accessToken;

  if (!accessToken) {
    return res.status(401).send({ error: 'No access token in session' });
  }
  try {
    const devices = await iotController.getDevices(accessToken);
    res.status(200).send(devices);
  } catch (err) {
    console.error('Error in /devices:', err);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

router.get(`/devices/:deviceId/gateway/clients`, async (req, res) => {
  const accessToken = (req.session as CustomSession).accessToken;

  if (!accessToken) {
    return res.status(401).send({ error: 'No access token in session' });
  }
  try {
    const apiResponse = await iotController.getDevices(accessToken);
    const deviceId = apiResponse.result[0]?._id;
    if (!deviceId) {
      return res.status(404).send({ error: 'Device ID not found' });
    }
    const data = await iotController.getDeviceGatewayClients(
      accessToken,
      deviceId,
    );
    res.status(200).send(data);
  } catch (err) {
    console.error('Error in /devices/:deviceId/gateway/clients:', err);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

export default router;
