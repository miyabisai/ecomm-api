const express = require('express');
//validator
//expressValidator.check();
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const { handleErrors } = require('./middlewares');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail
        ,requirePassword
        ,requirePasswordConfirmation
        ,requireEmailExist
        ,requirePasswordForUser 
      } = require('./validators');
//create sub router
// router = app 
const router = express.Router();


router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
  });

router.post('/signup',[
  requireEmail,
  requirePassword,
  requirePasswordConfirmation
],
handleErrors(signupTemplate),
async (req, res) => {
    const {email,password} = req.body;
    //Create a user
    const user = await usersRepo.create({email,password});
    //Store the id that user inside the users cookie
    req.session.userId = user.id; //Added by cookie session
    res.send('Account created!!!');
    
  });
  
  router.get('/signout',(req,res)=>{
    req.session = null;
    res.send('You are logged out.');
  });
  
  
router.get('/signin'
,(req,res)=>{
    res.send(signinTemplate({req}));
  });
  
router.post('/signin',
[
  requireEmailExist,
  requirePasswordForUser
],
handleErrors(signinTemplate),
async (req,res)=>{
    const {email,password} = req.body;
    const user = await usersRepo.getOneBy({email}); 
    // if(!user){
    //   return res.send('Email not found');
    // }
    // const errors = validationResult(req);
    // console.log(errors);
  
    // const validPassword = await usersRepo.comparePasswords(user.password,password);
    // if(!validPassword){
    //   return res.send('Invalid password.');
    // }
    //return session
   
    
    // if(!errors.isEmpty()){
    //   return res.send(signinTemplate({errors}));
    // }
    req.session.userId = user.id;
    //res.send('You are signed in');
    res.redirect('/admin/products');
});

module.exports = router;
  