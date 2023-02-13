const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

//validation chains
module.exports = {
    requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email.')
    .custom(async email=>{
      const existingUser = await usersRepo.getOneBy({email});
      if(existingUser){
        throw new Error('Email in use.Please Change another one.');
        // return 'Email in use.Please Change another one.';
      }
    }),
    requirePassword: check('password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Must be between 4 and 20 characters.'),
    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Must be between 4 and 20 characters.')
    .custom(async (passwordConfirmation,{ req } )=>{
        if(req.body.password !== passwordConfirmation){
          throw new Error('Password must match.');
          // return 'Password must match.';
        }
    }),
    requireEmailExist: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email.')
    .custom(async (email)=>{
      const user = await usersRepo.getOneBy({email});
      if(!user){
        // return res.send('Email not found');
        throw new Error('Email is not found!');
      }
    }),
    requirePasswordForUser: check('password')
    .trim()
    .isLength({min:4,max:20})
    .custom(async (password,{req})=>{
      const user = await usersRepo.getOneBy({email:req.body.email});
      if(!user){
        // return res.send('Email not found');
        throw new Error('Invalid Password!');
      }
      const validPassword = await usersRepo.comparePasswords(user.password,password);
      if(!validPassword){
        //return res.send('Invalid password.');
        throw new Error('Invalid password.');
      }
    }),
    requireTitle:check('title')
    .trim()
    .isLength({min:5,max:30})
    .withMessage('Must be between 5 and 40 characters.'),
    requirePrice:check('price')
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage('Must be a number greater than 1.')
};



// requirePasswordConfirmation: check('passwordConfirmation')
//     .trim()
//     .isLength({min:4,max:20})
//     .withMessage('Must be between 4 and 20 characters.')
//     .custom(async (passwordConfirmation,{ req } )=>{
//         if(req.body.password !== passwordConfirmation){
//           //throw new Error('Password must match.');
//           return 'Password must match.';
//         }
       
//     })