const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.get('/', (req, res) => {
  return res.status(200).send('app served successfully');
});

app.post('/', (req, res) => {
  return res.status(201);
});

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

app.listen(3000); //listens on port 3000 -> http://localhost:3000/
