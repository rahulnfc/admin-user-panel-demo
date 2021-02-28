var express = require('express');
const { response } = require('express');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  if (user) {
    res.render('index', { user });
  } else {
    res.redirect('/login')
  }
});

router.get('/login', (req, res) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('user/login', { "userloginErr": req.session.userloginErr });
    req.session.userloginErr = false
  }
});

router.get('/signup',(req, res) => {
  let user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('user/signup', { "emailExist": req.session.emailExist });
    req.session.emailExist = false
  }
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.userloggedIn = true
    req.session.user = response
    res.redirect('/')
  }).catch(() => {
    req.session.emailExist = true
    res.redirect('/signup')
  })
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userloggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.userloginErr = true
      res.redirect('/login')
    }
  })
});

router.get('/logout', (req, res) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.session.user=null
  req.session.userloggedIn=false
  res.redirect('/')
})

module.exports = router;
