import { Todo } from "../models";

const objectId = require("mongodb").ObjectID;
const express = require("express");
const router = express.Router();

/**
 * GET /todo/
 * returns all user todos
 */
router.get("/", async (req, res) => {
  const todos = await Todo.find({ userId: req.body.userId });
  return res.json(todos);
});

/**
 * GET /todo/:id
 * returns single user todo by id
 */
router.get("/:id", async (req, res) => {
  const todo = await Todo.findOne({
    _id: objectId(req.params.id),
    userId: req.body.userId,
  });
  return res.json(todo);
});

/**
 * POST /todo/
 * add new todo
 */
router.post("/", async (req, res) => {
  const { title, description, userId } = req.body;
  const todo = new Todo({ title, description, createdAt: new Date(), userId });
  const newTodo = await todo.save();
  return res.json(newTodo);
});

/**
 * PUT /todo/:id
 * update single todo by id
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  Todo.findByIdAndUpdate(
    { _id: objectId(id) },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
      },
    },
    { new: true }, // Pass this to return updated object (by default returns old one)
    (err, updatedTodo) => {
      res.json(updatedTodo);
    }
  );
});

/**
 * DELETE /todo/
 * delete single todo by id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  Todo.findByIdAndDelete({ _id: objectId(id) }, (err, deletedTodo) => {
    res.json(deletedTodo);
  });
});

module.exports = router;
