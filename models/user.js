const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        return value.length > 6;
      },
      message: "password must be more then 6 chars",
    },
  },
  address: {
    type: String,
    default: "",
  },
  tokenNt: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
