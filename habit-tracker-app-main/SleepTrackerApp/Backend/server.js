const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connection Success!!!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Import routes
const userRoutes = require("./routes/user");
const habitRoutes = require("./routes/habit");

// Routes
app.use("/user", userRoutes); // User registration and login routes
app.use("/habit", habitRoutes); // Habit management routes
app.use('/uploads', express.static('uploads'));


// Sample route for health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server is up and running at port ${PORT}`);
});
