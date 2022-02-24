import 'dotenv/config';
import { google } from 'googleapis';
import express from 'express';

const oauthCallbackResponse = new Promise((resolve) => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.get('/', (req, res) => {
    resolve(req.query);
    res.send('Check console to copy refresh token');
    server.close();
  });
  const server = app.listen(3456);
});

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_CLIENT_KEY,
  'http://localhost:3456/'
);

const scopes = ['https://www.googleapis.com/auth/drive.readonly'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Go to this url and authorize', url);
const { code } = await oauthCallbackResponse;
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);

console.log('Add refresh token to environment variables');
console.log(tokens);
