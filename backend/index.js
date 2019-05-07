import connectDb from "./models";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { jwtValidate } from "./helpers";

const app = express();

/** Add body parser to convert request body params */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Add cors to server */
app.use(cors());

/** Add authoriation routes */
app.use(require("./routes/authorizationRoutes"));

/** Add /todo model CRUD routes */
app.use("/todo", jwtValidate, require("./routes/todoRoutes"));

/**
 * GET /
 * Basic default route to initiate server
 * returns "Good game" string
 */
app.get("/", async (req, res) => {
  return res.send("Good game");
});

connectDb().then(async () => {
  // if (eraseDatabaseOnSync) {
  //   const mongoose = require("mongoose");
  //   createUsersWithMessages();
  // }
  app.listen(3001, () => {
    console.log("Example app listening on port 3001!");
  });
});
