import { User } from "../models";
import { jwtValidate, validateEmail } from "../helpers";

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * GET /me/
 * function to authenticate user by jwt token
 * if token is valid returns user object
 */
router.get("/me", jwtValidate, async (req, res) => {
  const user = await User.findById(req.body.userId).select("-password");
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
  });

  if (!user) return res.status(404).json({ message: "User doesn't exist" });

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (!result || err) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "ming_trick", {
      expiresIn: "1h",
    });

    const userData = user.toObject(); // Convert user into object to remove password before sending response
    delete userData.password;

    return res.json({
      user: userData,
      token,
    });
  });
});

/**
 * POST /registration/
 * registrate user (add new user) by unique email, login and password
 * returns new user object and jwt token
 */
router.post("/registration", async (req, res) => {
  const { login, email, password } = req.body;

  if (!login || !email || !validateEmail(email) || !password) {
    return res.status(400).json({
      message: {
        ...(!login ? { login: "Login is required" } : {}),
        ...(!email || (email && !validateEmail(email))
          ? { email: "Enter valid email" }
          : {}),
        ...(!password ? { password: "Password is required" } : {}),
      },
    });
  }

  const [loginUniqueError, emailUniqueError] = await Promise.all([
    User.findOne({ login }),
    User.findOne({ email }),
  ]);

  if (loginUniqueError)
    return res
      .status(400)
      .json({ message: { mainError: "Login is already in use" } });

  if (emailUniqueError)
    return res
      .status(400)
      .json({ message: { mainError: "Email is already in use" } });

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err)
      return res.status(400).json({ message: { mainError: "Password error" } });

    const user = new User({
      login,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: "user",
    });

    const newUser = await user.save();
    const token = jwt.sign({ id: newUser._id }, "ming_trick", {
      expiresIn: "1h",
    });

    return res.json({
      user: {
        login: newUser.login,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token,
    });
  });
});

module.exports = router;
