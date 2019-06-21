import { ChatMessage } from "../models";
import { getUnreadChatsCount, getUnreadChatMessagesCount } from "../helpers";

const objectId = require("mongodb").ObjectID;

/** Array of online users */
let users = [];

module.exports = (socket, io) => {
  const userDisconnect = () => {
    console.log("DISCONNECT");
    users = users.filter(i => i.socketId !== socket.id);
  };

  socket.emit("socketWorks", { horray: "Socket works" });

  socket.on("userIsOnline", userId => {
    users.push({
      userId,
      socketId: socket.id,
    });
  });

  socket.on("userIsOffline", userDisconnect);
  socket.on("disconnect", userDisconnect);
};
