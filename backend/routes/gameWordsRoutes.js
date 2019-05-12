import { GameWords } from "../models";

const objectId = require("mongodb").ObjectID;
const express = require("express");
const router = express.Router();

/**
 * GET /game/words
 * returns all game words
 */
router.get("/", async (req, res) => {
  const gameWords = await GameWords.find({});
  return res.json(gameWords);
});

/**
 * POST /game/words
 * add new game word
 */
router.post("/", async (req, res) => {
  const { word } = req.body;

  if (!word || word.length < 3) {
    return res.status(400).json({
      message: {
        ...(!word ? { word: "Word is required" } : {}),
        ...(word && word.length < 3
          ? { word: "Word length must be at least 3 characters" }
          : {}),
      },
    });
  }

  const addWord = new GameWords({ word, createdAt: new Date() });
  const newWord = await addWord.save();
  return res.json(newWord);
});

/**
 * PUT /game/words/:id
 * update single game word by id
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { word } = req.body;

  if (!word || word.length < 3) {
    return res.status(400).json({
      message: {
        ...(!word ? { word: "Word is required" } : {}),
        ...(word && word.length < 3
          ? { word: "Word length must be at least 3 characters" }
          : {}),
      },
    });
  }

  GameWords.findByIdAndUpdate(
    id,
    {
      $set: { word },
    },
    { new: true },
    (err, updatedWord) => {
      res.json(updatedWord);
    }
  );
});

/**
 * DELETE /game/words
 * delete single game word by id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  GameWords.findByIdAndDelete({ _id: objectId(id) }, (err, deletedWord) => {
    res.json(deletedWord);
  });
});

module.exports = router;
