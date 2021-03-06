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

    const usersCount = await User.find({}).count();

    const addUser = new User({
      login,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: usersCount === 0 ? "admin" : "user",
    });

    const newUser = await addUser.save();
    const token = jwt.sign({ id: newUser._id }, "ming_trick", {
      expiresIn: "1h",
    });

    const user = await User.findById(newUser._id).select("-password");

    return res.json({
      user,
      token,
    });
  });
});

const fileUpload = require("express-fileupload");
router.put(
  "/profile",
  jwtValidate,
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const { userId, data } = req.body;

    if (req.files) {
      const { avatar: userAvatar } = await User.findById(userId);
      if (userAvatar) {
        // remove initial avatar if exists
        const fs = require("fs");
        fs.unlink(
          `${require("app-root-path")}/uploads/avatars/${userAvatar.replace(
            "http://localhost:3001/avatars/",
            ""
          )}`,
          () => {}
        );
      }

      const filePath = `avatars/${userId}${Date.now()}${req.files.avatar.name}`;
      const fileServerUrl = `${require("app-root-path")}/uploads/${filePath}`;

      let avatar = await new Promise((resolve, reject) => {
        req.files.avatar.mv(fileServerUrl, err => {
          if (err) return res.status(400).json({ message: err });

          const fullImageUrl = `http://${req.get("host")}/${filePath}`;
          resolve(fullImageUrl);
        });
      });

      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            avatar,
          },
        },
        { new: true },
        (err, updatedUser) => {
          return res.json({ user: updatedUser });
        }
      );
    } else {
      if (
        data.login === "" ||
        (data.email === "" || (data.email && !validateEmail(data.email)))
      ) {
        return res.status(400).json({
          message: {
            ...(data.login === "" ? { login: "Login is required" } : {}),
            ...(data.email === "" || (data.email && !validateEmail(data.email))
              ? { email: "Enter valid email" }
              : {}),
          },
        });
      }

      const [loginUniqueError, emailUniqueError] = await Promise.all([
        User.findOne({
          login: data.login,
          _id: {
            $ne: userId,
          },
        }),
        User.findOne({
          email: data.email,
          _id: {
            $ne: userId,
          },
        }),
      ]);

      if (loginUniqueError)
        return res
          .status(400)
          .json({ message: { login: "Login is already in use" } });

      if (emailUniqueError)
        return res
          .status(400)
          .json({ message: { email: "Email is already in use" } });

      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            ...data,
          },
        },
        { new: true },
        (err, updatedUser) => {
          return res.json({ user: updatedUser });
        }
      );
    }
  }
);

module.exports = router;
