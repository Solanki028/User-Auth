const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const User = require('../model/User'); // Correct path to User model from src
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
mongoose.connect('mongodb://localhost/MyWebsite', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.use(express.static('public'));
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// Display login page
app.get("/", (req, res) => {
  res.render("login");
});

// Display signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { error: "Email is already taken." });
    }

    // Create new user with hashed password
    const newUser = new User({ name, email, password });
    await newUser.save(); // Save user to the database
    console.log("User saved successfully, redirecting to login...");
    res.redirect("/"); // Redirect to the login page after successful signup
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error signing up, please try again.");
  }
});

// Handle login form submission
app.post("/login", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // Check if user exists and password matches
    if (user && await user.comparePassword(req.body.password)) {
      res.render("home"); // Redirect to home if login is successful
    } else {
      // Render login with error message if credentials are incorrect
      res.render("login", { error: "Incorrect email or password!" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("login", { error: "Error logging in. Please try again." });
  }
});

// Start the server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});
