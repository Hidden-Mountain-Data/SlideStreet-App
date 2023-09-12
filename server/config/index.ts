import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const API_VERSION = process.env.API_VERSION as string;
export const CONNECTION_STRING = process.env.CONNECTION_STRING as string;
export const INHAND_IOT_API_KEY = process.env.INHAND_IOT_API_KEY as string;
export const IOT_ENDPOINT = process.env.IOT_ENDPOINT as string;
export const SERVER_PORT = process.env.SERVER_PORT as string;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const VERIZON_API_KEY = process.env.VERIZON_API_KEY as string;
export const CLIENT_ID = process.env.CLIENT_ID as string;
export const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
