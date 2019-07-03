import { User } from "../models";

const express = require("express");
const router = express.Router();

/**
 * GET /users
 * Returns list of all users
 */
router.get("/", async (req, res) => {
  const users = await User.find({}).select("-password");
  return res.json({ users });
});

module.exports = router;
