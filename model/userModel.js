import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Cart field
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // Password reset fields
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
export default User;