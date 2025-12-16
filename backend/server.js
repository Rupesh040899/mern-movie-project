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
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
