import { User } from "../models";
import { jwtValidate } from "../helpers";

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * GET /me/
 * function to authenticate user by jwt token
 * if token is valid returns user object
 * if token is not valid returns error
 */
router.get("/me", jwtValidate, async (req, res) => {
  const user = await User.findById(req.body.userId);

  // const token = jwt.sign({ id: user._id }, "ming_trick", {
  //   expiresIn: "1h",
  // });
  return res.json({ user });
});

/**
 * POST /login/
 * sign in user by login and password
 * returns user object and jwt token
 */
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    login: req.body.login,
    password: req.body.password
  });

  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, "ming_trick", {
    expiresIn: "1h"
  });
  return res.json({ user, token });
});

/**
 * POST /registration/
 * registrate user (add new user) by unique email, login and password
 * returns new user object and jwt token
 */
router.post("/registration", async (req, res) => {
  const { login, email, password } = req.body;

  const loginUniqueError = await User.findOne({ login });
  if (loginUniqueError)
    return res.status(400).json({ message: "Login is already in use" });

  const emailUniqueError = await User.findOne({ email });
  if (emailUniqueError)
    return res.status(400).json({ message: "Email is already in use" });

  const user = new User({ login, email, password, createdAt: new Date() });

  const newUser = await user.save();
  const token = jwt.sign({ id: newUser._id }, "ming_trick", {
    expiresIn: "1h"
  });

  return res.json({
    user: newUser,
    token
  });
});

module.exports = router;
