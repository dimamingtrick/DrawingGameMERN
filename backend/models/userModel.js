import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  createdAt: {
    // type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
