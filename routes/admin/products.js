const express = require('express');
// const {validationResult} = require('express-validator');
const multer = require('multer');

const { handleErrors,requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const {requireTitle,requirePrice} = require('./validators');


const router = express.Router();
//handle upload file
const upload = multer({storage:multer.memoryStorage()});
router.get('/admin/products',requireAuth,async (req,res)=>{
    // if(!req.session.userId){
    //     return res.redirect('/signin');
    // }
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products}));
});

router.get('/admin/products/new',requireAuth,(req,res)=>{
    res.send(productsTemplate({}));
});

router.post(
    '/admin/products/new',
    requireAuth,
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsTemplate),
    async (req,res)=>{
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     return res.send(productsTemplate({errors}));
        // }
        const image = req.file.buffer.toString('base64');
        const { title,price} = req.body;
        await productsRepo.create({ title,price,image});

        // res.send('submitted');
        res.redirect('/admin/products');
        
    }
);
   
router.get('/admin/products/:id/edit',requireAuth,async (req,res)=>{
    const product = await productsRepo.getOne(req.params.id);
    if(!product){
        return res.send('Product not found');
    }
    res.send(productsEditTemplate({ product }));
});

router.post('/admin/products/:id/edit',requireAuth,async(req,res)=>{

});

module.exports = router;