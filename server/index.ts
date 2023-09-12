import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import session from 'express-session';
import {
  API_VERSION,
  CONNECTION_STRING,
  SERVER_PORT,
  SESSION_SECRET,
} from './config';
import customSessionMiddleware from './middleware/customSession';
import authRoutes from './routes/authRoutes';
import iotRoutes from './routes/iotRoutes';
import oauthRoutes from './routes/oauthRoutes';

config();

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(customSessionMiddleware);
app.use(`${API_VERSION}`, authRoutes);
app.use(`${API_VERSION}/api`, iotRoutes);
app.use(`${API_VERSION}/oauth2`, oauthRoutes);

app.listen(SERVER_PORT, () => {
  console.log(
    `Server up and running at ${CONNECTION_STRING}:${SERVER_PORT}${API_VERSION}`,
  );
});
