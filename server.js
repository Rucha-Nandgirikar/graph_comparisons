const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const router = require("./routes/comparisonTables")
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  console.log("Page Served")
  res.json({ message: "Page Served" });
});

app.use("/", router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
