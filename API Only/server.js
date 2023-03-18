const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {users,products} = require('./data')
const app = express();
const port = 5000;

const cartItems = {};

// middleware to parse request body as JSON
app.use(bodyParser.json());

// login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// products endpoint
app.get('/products', (req, res) => {
  res.json(products);
});

// cart endpoint
app.post('/cart', (req, res) => {
  const { userId, productId } = req.body;
  if (!cartItems[userId]) {
    cartItems[userId] = {};
  }
  if (!cartItems[userId][productId]) {
    cartItems[userId][productId] = 1;
  } else {
    cartItems[userId][productId]++;                                     
  }
  res.json({ message: 'Product added to cart', //format is carItems{"userId":{"product id":"quantity"}    }
            cartItems });
});

// place order endpoint
app.post('/place-order', (req, res) => {
  const { userId } = req.body;
  const items = cartItems[userId];
  if (!items) {
    res.status(400).json({ message: 'No items in cart' });
  } else {
    // calculate total price
    const totalPrice = Object.keys(items).reduce((total, productId) => {
      const product = products.find(p => p.id == productId);
      return total + (product ? product.price * items[productId] : 0);
    }, 0);
    // create order object
    const order = { userId, items, totalPrice };
    cartItems[userId] = {};
    res.json({ message: 'Order placed', order });
  }
});

// users endpoint
app.get('/users', (req, res) => {
  res.json(users); 
});

// start server
app.listen(port,()=>{
    console.log("server running on:" + port)
})