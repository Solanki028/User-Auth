const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password
    });

    // Save the user to the database
    await newUser.save();

    // Redirect to login page after successful signup
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.render('signup', { errorMessage: 'Error occurred while signing up.' });
  }
});

module.exports = router;
