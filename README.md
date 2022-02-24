# Configure Notion
- Create new application for notion
- Get the api key and put it to .env as `NOTION_API_KEY`
- Go to the database page in notion 
  - Copy id from url and put it to .env as `NOTION_DATABASE_ID`
  - Click share and "invite" your newly created application

# Configure Google Drive
- Go to Google Cloud Platform Console and create new project
- Create new authorization with OAuth2 and copy keys to .env `CLIENT_ID` & `SECRET_CLIENT_KEY`
- Add your email to test users
- Go to your folder in Google Drive and copy the id from url to .env `FOLDER_ID`
- Run `node ./getGoogleRefreshToken.js` to acquire refresh token and add it to .env `REFRESH_TOKEN`