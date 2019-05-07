import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
