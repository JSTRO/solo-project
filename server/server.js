const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  console.log('get request to /api');
  return res.status(200).json(fs.readFileSync('./server/data.json'));
  // return res.status(200).send({ example: 'json' });
});

app.post('/api', (req, res) => {
  console.log('./req.body', req.body);
  fs.appendFileSync('./server/data.json', JSON.stringify(req.body));
  return res.status(200).send(req.body);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign(defaultErr, err.params);

  console.log('ERROR: ', errorObj.log);

  return res.status(errorObj.status).json(errorObj.message);
});

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

app.listen(PORT); //listens on port 3000 -> http://localhost:3000/
module.exports = app;
