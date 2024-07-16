// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Index - Show all products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.render('products', { products });
});

router.get('/admin', async (req, res) => {
  const products = await Product.find({});
  res.render('data', { products });
});

// New - Show form to create new product
router.get('/new', (req, res) => {
  res.render('create');
});

// Create - Add new product to DB
router.post('/', async (req, res) => {
  await Product.create(req.body.product);
  res.redirect('/product');
});

// Edit - Show form to edit product
router.get('/:id/edit', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('edit', { product });
});

// Update - Update product in DB
router.put('/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body.product);
  res.redirect('/product');
});

// Delete - Remove product from DB
router.delete('/:id', async (req, res) => {
  await Product.deleteOne({ _id:req.params.id});
  res.redirect('/product');
});

router.get('/add-to-cart/:name/:price', (req, res) => {
  const name = req.params.name;
  const price =  Number(req.params.price);
  if (!req.session.cart) {
      req.session.cart = [];
  }
  console.log( req.session.cart);
  req.session.cart.push({ name, price, quantity: 1 , subtotal : price*1});
  res.redirect('/product');
});

module.exports = router;
