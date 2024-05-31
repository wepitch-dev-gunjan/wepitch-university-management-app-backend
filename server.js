const express = require("express");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI
const NODE_ENV = process.env.NODE_ENV || "development";

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: '*',
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true,
  })
);

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Database is connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the university management App");
});

// Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

app.listen(PORT, () => {
  console.log(`Server started in ${NODE_ENV} mode at port: ${PORT}`);
});

module.exports = app;
