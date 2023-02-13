const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const { comparePasswords } = require('./repositories/users');

const app = express();

//middle ware 
app.use(express.static('public'));

//row data => data
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
  keys:['helloword']
}));

//sub router
app.use(authRouter);
app.use(productsRouter);



app.listen(3000, () => {
  console.log('Listening');
});

