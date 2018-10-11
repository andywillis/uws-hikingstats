const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');

const { authorise, getGPXList } = require('../server/auth');
const getCredentials = require('../server/auth/getCredentials');

const app = express();

app.set('port', (process.env.PORT || 3001));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'production') {
  const fixedPath = path.resolve(__dirname, '../dist');
  app.use(express.static(fixedPath));
}

function storeCredentials([ credentials, token ]) {
  return new Promise((resolve) => {
    app.credentials = credentials;
    app.token = token;
    resolve();
  });
}

function getGPX() {
  const { credentials, token } = app;
  const query = '"1K12a4Shmg4sWbAstNPkRKM08bzQO9ix8" in parents';
  return new Promise((resolve) => {
    authorise({ credentials, token }, (authentication) => {
      getGPXList(authentication, query).then((data) => {
        resolve(data);
      });
    });
  });
}

function extractIds(arr) {
  return Promise.resolve(arr.map(el => el.id));
}

function showIds(arr) {
  console.log(arr);
}


getCredentials()
  .then(storeCredentials)
  .then(getGPX)
  .then(extractIds)
  .then(showIds);

app.get('/api', (req, res) => {
  res.json(app.data);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  //  res.sendFile(path.join(`${__dirname}/../build/index.html`));
});

http.createServer(app).listen(app.get('port'));
console.log('Server created on port', app.get('port'));
