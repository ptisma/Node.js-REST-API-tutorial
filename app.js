const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    //valid flile
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//midleware that parses JSON
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
//app.use(bodyParser.json()); // application/json
app.use(express.json());
//registering multer as a middleware
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

//setting up header options for every server's response
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//routing
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


//error handle middleware for errors from routing from controllers
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//conecting to the database and starting up the server
//auto creating the database which is defined in the URL
mongoose
  .connect(
    'mongoURL'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));




  /*
app.use([path,] callback [, callback...])
Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.
  
express.static(root, [options])
To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
The root argument specifies the root directory from which to serve static assets.
The __dirname in a node script returns the path of the folder where the current JavaScript file resides

*/
