var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
var authenticate = require('../authenticate');
var jwt = require('jsonwebtoken');

router.get('/signup',(req,res) =>{
	res.render('signup');
})

router.get('/signin',(req,res) =>{
   // console.log("paarams "+req.query.message);
   var accountcreated;
    if (req.query.message == "accreg") {
        console.log("im here");
        accountcreated='Account Created, Please log in'
    } 
	res.render('signin',{accountcreated});
})

router.post('/signup', (req, res, next) => {
    console.log("bug:"+req.body.password)
    passport.authenticate('register', (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info != undefined) {
          console.log(info.message);
          res.send(info.message);
        } else {
          req.logIn(user, err => {
            const data = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              category: req.body.category,
              username: user.username,
            };
            User.findOne({
                username: data.username,
            }).then(user => {
                User.update({username: data.username},{$set: {
                  firstname: data.first_name,
                  lastname: data.last_name,
                  email: data.email,
                }})
                .then(() => {
                  console.log('user created in db');
                  res.status(200).redirect('signin?message=accreg');
                  return;
                });
            });
          });
        }
      })(req, res, next);
  });

  router.post('/signin', (req, res,next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info != undefined) {
          console.log(info.message);
          res.send(info.message);
        } else {
          req.logIn(user, err => {
            User.findOne({
                username: user.username,
            }).then(user => {
              const token = jwt.sign({ id: user.username }, '12345-67890-09876-54321');
              res.status(200).send({
                auth: true,
                token: token,
                message: 'user found & logged in',
              });
            });
          });
        }
      })(req, res, next);
	
  });

router.get('/logout', (req, res, next) => {
	if (req.session) {
	  req.session.destroy();
	  res.clearCookie('session-id');
	  res.redirect('/');
	}
	else {
	  var err = new Error('You are not logged in!');
	  err.status = 403;
	  next(err);
	}
});
module.exports = router;