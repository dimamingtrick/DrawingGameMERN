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

  const wordAlreadyInUse = await GameWords.findOne({ word });

  if (!word || word.length < 3 || wordAlreadyInUse) {
    return res.status(400).json({
      message: {
        ...(wordAlreadyInUse ? { word: "Word is already in use" } : {}),
        ...(!word ? { word: "Word is required" } : {}),
        ...(word && word.length < 3
          ? { word: "Word length must be at least 3 characters" }
          : {})
      }
    });
  }

  const addWord = new GameWords({ word });
  const newWord = await addWord.save();
  return res.json(newWord);
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
