import connectDb from "./models";
import express from "express";
import cors from "cors";
import { jwtValidate } from "./helpers";

const app = express();

/** Add express body parser to convert request body params */
app.use(express.json());

/** Add cors to server */
app.use(cors());

/** Add authoriation routes */
app.use(require("./routes/authorizationRoutes"));

/** Add /todo model CRUD routes
 *  Require JWT token
 */
app.use("/todo", jwtValidate, require("./routes/todoRoutes"));

/**
 * GET /
 * Basic default route to initiate server
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
