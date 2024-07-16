// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/outfitter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Session and Flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// Middleware to set local variables for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.session.user;
  next();
});

// Set up view engine
app.set('view engine', 'ejs');

// Routes
const productRoutes = require('./routes/product');
app.use('/product', productRoutes);
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);


app.get('/', (req, res) => {

});

app.get('/cart', (req, res) => {
  if(!req.session.user)
    res.redirect('/login');
  else{
  const cart = req.session.cart || [];
  res.render('checkout', { cart });
}
});

app.get('/about', (req, res) => {

  res.render('about');
});

app.get('/update-cart/:name/:qty', (req, res) => {
  const name = req.params.name;
  const qty = Number(req.params.qty);
  if (!req.session.cart) {
    res.redirect('/product')
  }
  let cart = req.session.cart;
  const item = cart.find(i => i.name === name);
  if (item) {
    cart.forEach(obj => {
      if (obj.name === name) {
        obj.subtotal = qty * obj.price;
      }
    });
    req.session.cart = cart;
  }
  console.log(cart);
  res.json({ success: true, cart });
});



app.post('/update-cart', (req, res) => {
  const { name, quantity } = req.body;
  const price = Number(req.body);
  const cart = req.session.cart || [];
  const item = cart.find(i => i.name === name);
  if (item) {
    item.quantity = quantity;
  }
  req.session.cart = item;
  const totalPrice = cart.reduce((sum, item) => sum + (price * item.quantity), 0);
  res.json({ updatedItem: item, totalPrice });
});

// Admin Login Route
app.get('/login', (req, res) => {
  if (req.session.user)
    res.redirect('/product');
  else
    res.render('login');
});

app.post('/login', async (req, res) => {

  const { username, password } = req.body;
  const user = await User.findOne({ 'email': username });
  if (user && username === user.email && password === user.password) {
    req.session.user = { user: user };
    req.flash('success', 'Logged in as Admin');
    res.redirect('/product');
  } else {
    req.flash('error', 'Invalid credentials');
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
