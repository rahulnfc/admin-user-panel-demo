var express = require('express');
const { render } = require('../app');
const adminHelpers = require('../helpers/admin-helpers');
var router = express.Router();
const verifyLogin=(req,res,next)=>{
 let admin= req.session.admin
  if(admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

/* GET users listing. */
router.get('/', function (req, res) {
  let admin = req.session.admin
  if (admin) {
    adminHelpers.getAllUsers().then((users) => {
      res.render('admin/admin', { admin, users });
    })
  } else {
    res.redirect('/admin/login')
  }
});

router.get('/login', function (req, res) {
  let admin = req.session.admin
  if (admin) {
    res.redirect('/admin')
  } else {
      res.render('admin/login', { "adminloginErr": req.session.adminloginErr, "adminemailErr": req.session.adminemailErr, "adminpassErr": req.session.adminpassErr })
      req.session.adminemailErr = false
      req.session.addminpassErr = false
  }
});

router.post('/login', (req, res) => {
  admin = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 1234
  }
  if (admin.email != req.body.Email) {
    req.session.adminemailErr = true
    res.redirect('/admin/login');
    req.session.adminemailErr = false
  }
  else if (admin.password != req.body.Password) {
    req.session.adminpassErr = true
    res.redirect('/admin/login');
    req.session.adminpassErr = false
  }
  else if (admin.email == req.body.Email && admin.password == req.body.Password) {
    req.session.adminloggedIn = true
    req.session.admin = admin
    res.redirect('/admin');
  } else {
    req.session.adminloginErr = true
    res.redirect('/admin');
  }
});

router.get('/logout',(req, res) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.session.admin=null
  req.session.adminloggedIn=false
  req.session.adminpassErr=false
  req.session.adminemailErr=false
  res.redirect('/admin');
});

router.get('/add-user',verifyLogin,(req, res) => {
    res.render('admin/add-user', { "emailExist": req.session.emailExist });
    req.session.emailExist = false
});

router.post('/add-user', (req, res) => {
  adminHelpers.addUser(req.body).then((response) => {
    console.log(response);
    res.redirect('/admin');
  }).catch(() => {
    req.session.emailExist = true
    res.redirect('/admin/add-user')
  })
});

router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  console.log(userId);
  adminHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin')
  });
});

router.get('/edit-user/:id',verifyLogin, async (req, res) => {
  let userData = await adminHelpers.getUserDetails(req.params.id)
  res.render('admin/edit-user', { userData })
});

router.post('/edit-user/:id', (req, res) => {
  adminHelpers.updateUser(req.params.id, req.body).then(() => {
    res.redirect('/admin')
  })

});

module.exports = router;
