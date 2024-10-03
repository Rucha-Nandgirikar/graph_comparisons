const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const router = require("./routes/comparisonTablesRoutes")
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}); 

app.use("/", router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

module.exports = app;