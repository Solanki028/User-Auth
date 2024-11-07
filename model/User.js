const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Automatically convert email to lowercase
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      // Hash the password with bcrypt using a salt factor of 10
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      next(error); // Pass error to next middleware
    }
  }
  next(); // Proceed to save the document
});

// Method to compare candidate password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('User', userSchema);
