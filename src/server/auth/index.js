/* eslint camelcase: 0 */

const { google } = require('googleapis');

function authorise({ credentials, token }, callback) {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);
  callback(oAuth2Client);
}

function getGPXList(auth, query) {
  const drive = google.drive({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    drive.files.list({
      q: query
    }, (err, res) => {
      if (err) reject(err);
      resolve(res.data.files);
    });
  });
}

module.exports = { authorise, getGPXList };
