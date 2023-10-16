// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
//  create express app
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 4000;

console.log(process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

app.get("/health", async (req, res) => {
  res.status(200).json("Server is up and running");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const authRoutes = require("./routes/auth");

const jobRoutes = require("./routes/jobs");

app.use("/api", authRoutes);
app.use("/api", jobRoutes);
