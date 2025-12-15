require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


// Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
