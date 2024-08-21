// express
// enviornment variables
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const verifyToken = require("./middleware/verifyToken");
const cors = require("cors");
const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));

app.post("/test", verifyToken, (req, res) => {
  res.json({ message: "Hello" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("App is running on port ", port);
});
