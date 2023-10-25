const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    profile: { type: String, default: null },
    username: { type: String, required: true, unique: true },
    user_type: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    verification: {
      type: Boolean,
    },
    token: {
      type: String,
      default: "",
    },
    // addedBy: {
    //     type: String,
    // },
    // addedBy_id: {
    //     type: String,
    // },
    // is_active: {
    //     type: Boolean,
    // },
    // isAdmin: {
    //     type: Boolean,
    //     default: false,
    // },

    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("user", UserSchema);
