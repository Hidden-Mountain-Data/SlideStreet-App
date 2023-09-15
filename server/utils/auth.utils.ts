import { CLIENT_ID, CLIENT_SECRET } from '../config';

export const base64Credentials = Buffer.from(
  `${CLIENT_ID}:${CLIENT_SECRET}`,
).toString('base64');
