const express = require('express');
const router = express.Router();
const User = require('../models/user');

// View Products
router.get('/', (req, res) => {

     res.redirect('/product')

});

router.get('/signup', (req, res) => {
  res.render('register');
});

// Register Route
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  const newUser = new User({ username, email, password});
  if(newUser.save())
    res.render('login');
});

// Add to Cart
router.post('/cart/add', (req, res) => {
  // Implement cart functionality
});



module.exports = router;
