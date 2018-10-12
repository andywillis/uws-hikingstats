const fs = require('fs');

module.exports = function () {

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      resolve({
        credentials: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_url: process.env.REDIRECT_URL
        },
        token: {
          access_token: process.env.ACCESS_TOKEN,
          refresh_token: process.env.REFRESH_TOKEN,
          token_type: process.env.TOKEN_TYPE
        }
      });

    } else {

      const HOME_DIR = `${process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE}/.credentials/`;
      const CREDENTIALS_PATH = `${HOME_DIR}uws-hikestats-credentials.json`;
      const TOKEN_PATH = `${HOME_DIR}uws-hikestats-token.json`;

      fs.readFile(`${CREDENTIALS_PATH}`, (err, credentialsData) => {
        fs.readFile(`${TOKEN_PATH}`, (err, tokenData) => {
          if (err) reject(err);
          const credentials = JSON.parse(credentialsData).installed;
          const token = JSON.parse(tokenData);
          resolve({
            credentials: {
              client_id: credentials.client_id,
              client_secret: credentials.client_secret,
              redirect_uris: credentials.redirect_uris
            },
            token: {
              access_token: token.access_token,
              refresh_token: token.refresh_token,
              token_type: token.token_type
            }
          });

        });

      });

    }
  });
};
