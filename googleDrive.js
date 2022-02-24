import 'dotenv/config';
import { google } from 'googleapis';

if (!process.env.REFRESH_TOKEN) {
  throw new Error(
    'Refresh token is not present in environment variables. Run `node getRefreshToken.js` locally to generate the token and place it in environment variable `REFRESH_TOKEN`.'
  );
}

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_CLIENT_KEY
);
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({
  auth: oauth2Client,
  version: 'v3',
});

const getFilesPageFromFolder = (pageToken) =>
  new Promise((resolve, reject) =>
    drive.files.list(
      {
        q: `parents in '${process.env.FOLDER_ID}' and trashed=false`,
        fields:
          'nextPageToken, files(id, name, createdTime, modifiedTime, webContentLink, webViewLink, trashed)',
        spaces: 'drive',
        pageToken,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.data);
        }
      }
    )
  );

export const getAllFilesFromFolder = () =>
  new Promise(async (resolve, reject) => {
    let allFiles = [];

    let lastPageToken = null;
    do {
      const { files, pageToken } = await getFilesPageFromFolder(lastPageToken);
      lastPageToken = pageToken;
      allFiles = allFiles.concat(files);
    } while (lastPageToken);

    resolve(allFiles);
  });
