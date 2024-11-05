const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();



// Serve static files from the views/js directory
app.use(express.static(path.join(__dirname, "views")));

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'always-hapii', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


// API and other routes
const apiRoutes = require('./routes/apiRoutes/api');
const htmlRoutes = require('./routes/htmlRoutes/web');

// API Routes
app.use("/api", apiRoutes);

// HTML Routes
app.use("/", htmlRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

module.exports = app;
