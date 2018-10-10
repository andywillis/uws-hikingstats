const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const GoogleAuth = require('google-auth-library');

if (!process.env.FILE_ID) require('../../../../.config/uws');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_DIR = `${process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE }/.credentials/`;
const TOKEN_PATH = `${TOKEN_DIR}uws.json`;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, fn) {
  const clientSecret = credentials.client_secret;
  const clientId = credentials.client_id;
  const redirectUrl = credentials.redirect_url;
  const auth = new GoogleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    oauth2Client.credentials = JSON.parse(token);
    callback(oauth2Client, fn);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getBlogData(auth, callback) {
  const service = google.drive('v3');
  const id = process.env.FILE_ID;
  service.files.get({
    auth,
    fileId: id,
    alt: 'media'
  }, function (err, data) {
    callback(data);
  });
}

module.exports = function (callback) {
  authorize({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URL
  }, getBlogData, callback);
}
