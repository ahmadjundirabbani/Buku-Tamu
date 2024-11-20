require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');

// npm uninstall express-flash-message
//const { flash } = require('express-flash-message');

// npm install connect-flash
const flash = require('connect-flash');

const session = require('express-session');
const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database  
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to BukuTamu DB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  })
);

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/customer'))

// Handle 404
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
