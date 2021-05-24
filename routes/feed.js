const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();



// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);


////express validators, middlewares, multiple ones in array
// POST /feed/post
router.post(
  '/post',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getPost);


router.put(
  '/post/:postId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

//dynamic routing /:blabla
router.delete('/post/:postId', isAuth, feedController.deletePost);

//exporting whole module as a router
module.exports = router;



/*
When var app = express() is called, an app object is returned. Think of this as the main app.

When var router = express.Router() is called, a slightly different mini app is returned. The idea behind the mini app is that each route in your app can become quite complicated, and you'd benefit from moving all that code into a separate file. 
Each file's router becomes a mini app, which has a very similar structure to the main app

using app.js to write routes means that they are accessible to all the users as app.js is loaded on application start. 
However, putting routes in express.router() mini apps protect and restrict their accessibility.

router.METHOD(path, [callback, ...] callback)
The router.METHOD() methods provide the routing functionality in Express, where METHOD is one of the HTTP methods, such as GET, PUT, POST, and so on, in lowercase. Thus, the actual methods are router.get(), router.post(), router.put(), and so on.
You can provide multiple callbacks, and all are treated equally, and behave just like middleware, except that these callbacks may invoke next('route') to bypass the remaining route callback(s).



*/