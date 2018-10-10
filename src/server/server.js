const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const { getData } = require('../api');

const app = express();

app.set('port', (process.env.PORT || 3001));
app.use(compression());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../dist')));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

getData((data) => {
  app.data = JSON.parse(data);
});

app.get('/api', (req, res) => {
  res.json(app.data);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  //  res.sendFile(path.join(`${__dirname}/../build/index.html`));
});

http.createServer(app).listen(app.get('port'));

console.log('Server created on port', app.get('port'));
