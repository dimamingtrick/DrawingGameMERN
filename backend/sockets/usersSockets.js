import { toggleUserOnlineStatus } from "../helpers";

/** Array of online users */
let users = [];

module.exports = (socket, io) => {
  const userDisconnect = () => {
    const userOffline = users.find(i => i.socketId === socket.id);
    users = users.filter(i => i.socketId !== socket.id);

    if (userOffline) toggleUserOnlineStatus(userOffline.userId, false, io);
  };

  socket.emit("socketWorks", { horray: "Socket works" });

  socket.on("userIsOnline", userId => {
    users.push({
      userId,
      socketId: socket.id,
    });

    toggleUserOnlineStatus(userId, true, io);
  });

  socket.on("userIsOffline", userDisconnect);
  socket.on("disconnect", userDisconnect);
};
