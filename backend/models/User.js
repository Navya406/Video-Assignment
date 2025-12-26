const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['Viewer', 'Editor', 'Admin'], 
      default: 'Viewer', 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('User', userSchema);