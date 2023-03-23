const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { fireEvent } = require('@testing-library/react');

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
  const fileArray = [];
  // data.json needs to update based on what it is in uploads folder
  // PLEASE REFACTOR INTO MIDDLEWARE FOR THE LOVE OF GOD
  fs.readdir('./server/uploads', (err, files) => {
    if (err) console.log(err);
    else {
      fs.writeFileSync('./server/data.json', JSON.stringify([]));
      files.forEach((file) => {
        if (file[0] !== '.') {
          fs.readFile(
            `./server/uploads/${file}`,
            { encoding: 'base64' },
            (err, data) => {
              if (err) {
                console.log(err);
                return res.status(500).send('Could not retrieve response');
              } else {
                const fileData = JSON.parse(
                  fs.readFileSync('./server/data.json')
                );
                const dataToSend = {
                  id: file.slice(0, -4),
                  url: data,
                  name: 'LETS GOOOOOOOOOO',
                  timestamp: Date.now(),
                };
                console.log('dataToSend', dataToSend.id);
                fileArray.push(dataToSend);
                // files.length - 1 to account for .DS_Store
                if (fileArray.length === files.length - 1) {
                  fs.writeFileSync(
                    './server/data.json',
                    JSON.stringify(fileArray)
                  );
                  return res.status(200).send(fileArray);
                }
              }
            }
          );
        }
      });
    }
  });
});

app.post('/api', (req, res) => {
  // });
  console.log(req.file, req.body);

  fs.writeFileSync('./server/data.json', JSON.stringify(req.body));
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
