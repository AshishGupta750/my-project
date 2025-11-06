const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users have the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false, // Default new users to not be admins
    },
    // You can add other fields like 'firstName', 'lastName', etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);