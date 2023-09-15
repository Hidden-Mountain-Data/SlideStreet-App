import { Router } from 'express';
import { makeLoginRequest } from '../../controllers/authController';
import { CustomSession } from '../../types/customSessionTypes';

const router = Router();

router.post(`/auth/login`, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const username = email;
    const tokens = await makeLoginRequest(username, password);

    if (tokens.accessToken && tokens.refreshToken) {
      (req.session as CustomSession).accessToken = tokens.accessToken;
      (req.session as CustomSession).refreshToken = tokens.refreshToken;

      res.status(200).send({
        message: 'Successfully logged in!',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
});

export default router;
