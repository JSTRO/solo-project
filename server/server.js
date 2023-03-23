const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, './server/uploads');
  },
});

const upload = multer({ storage });

const PORT = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  console.log('get request to /api');
  fs.readFile(
    './server/uploads/e55349e1-4e46-47da-a47d-f502807fc993.ogg',
    { encoding: 'base64' },
    (err, data) => {
      if (err) {
        return res.status(500).send('Could not retrieve response');
      } else {
        return res.status(200).send(data);
      }
    }
  );
});

app.post('/api', upload.any('file'), (req, res) => {
  // const { buffer: data } = req.file;
  // fs.open('server/audio/data.webm', 'w+', (err, fd) => {
  //   fs.writeFile(fd, data, (err) => {
  //     fs.close(fd, (err) => {
  //       return res.status(201).send('data.webm');
  //     });
  //   });
  // });
  console.log(req.file, req.body);

  // fs.writeFileSync('./server/data.json', JSON.stringify([req.body]));
  return res.status(200).send({ success: true });
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
