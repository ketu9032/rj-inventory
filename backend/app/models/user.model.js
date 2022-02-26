const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
  {
    user_name: {
      type: String
    },

    first_name: {
      type: String
    },
    last_name: {
      type: String
    },

    email: {
      type: String
    },

    password: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('users', UserSchema);
