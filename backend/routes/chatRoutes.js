import { Chat, ChatMessage, User } from "../models";

const objectId = require("mongodb").ObjectID;
const express = require("express");
const router = express.Router();

/**
 * GET /chats
 * returns all user todos
 */
router.get("/", async (req, res) => {
  const { userId } = req.body;

  const chats = await Chat.find({ users: objectId(userId) }).populate([
    {
      path: "users",
      select: "-password"
    }
  ]);

  if (chats.length === 0) {
    const allUsers = await User.find({
      _id: {
        $ne: objectId(userId)
      }
    });
    allUsers.forEach(async user => {
      const chat = new Chat({
        users: [objectId(userId), objectId(user._id)]
      });
      await chat.save();
    });

    const chats = await Chat.find({ users: objectId(userId) }).populate([
      {
        path: "users",
        select: "-password"
      }
    ]);
    return res.json(chats);
  }

  return res.json(chats);
});

/**
 * GET /chats/:id
 * returns single user todo by id
 */
router.get("/:id", async (req, res) => {
  const todo = await Chat.findOne({
    _id: objectId(req.params.id),
    userId: req.body.userId
  });
  return res.json(todo);
});

/**
 * POST /chats
 * add new todo
 */
router.post("/", async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !description || description.length < 10) {
    return res.status(400).json({
      message: {
        ...(!title ? { title: "Title is required" } : {}),
        ...(!description ? { description: "Description is required" } : {}),
        ...(description && description.length < 10
          ? { description: "Description length must be at least 10 characters" }
          : {})
      }
    });
  }

  const todo = new Todo({ title, description, createdAt: new Date(), userId });
  const newTodo = await Chat.save();
  return res.json(newTodo);
});

/**
 * PUT /chats/:id
 * update single todo by id
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description || description.length < 10) {
    return res.status(400).json({
      message: {
        ...(!title ? { title: "Title is required" } : {}),
        ...(!description ? { description: "Description is required" } : {}),
        ...(description && description.length < 10
          ? { description: "Description length must be at least 10 characters" }
          : {})
      }
    });
  }

  Chat.findByIdAndUpdate(
    { _id: objectId(id) },
    {
      $set: {
        title: req.body.title,
        description: req.body.description
      }
    },
    { new: true }, // Pass this to return updated object (by default returns old one)
    (err, updatedTodo) => {
      res.json(updatedTodo);
    }
  );
});

/**
 * DELETE /chats/:id
 * delete single todo by id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  Chat.findByIdAndDelete({ _id: objectId(id) }, (err, deletedTodo) => {
    res.json(deletedTodo);
  });
});

module.exports = router;
