import React, { useEffect } from "react";
import { Tooltip } from "reactstrap";
import { FaHeart } from "react-icons/fa";
import moment from "moment";

import defaultAvatar from "../../../assets/defaultAvatar.png";
import { socket } from "../../../pages/DashboardContainer/DashboardContainer";
import "./chat-message.css";

const ChatMessage = ({ message, userFrom, user, likeMessage }) => {
  const otherUserReadMessage =
    message.readBy.length === 1 && message.userId === user._id;

  // update readBy status of message
  useEffect(() => {
    if (
      message.userId !== user._id &&
      !message.readBy.find(i => i === user._id)
    ) {
      socket.emit("userReadChatMessage", {
        userId: user._id,
        messageId: message._id,
        chatId: message.chatId,
      });
    }
  }, []);

  const handleLikeMessage = () => {
    if (message.userId !== user._id)
      likeMessage(
        message._id,
        !message.likedBy.find(i => i === user._id)
          ? "userLikesMessage"
          : "userRemoveLikeFromMessage"
      );
  };

  return (
    <div
      className={`single-message ${
        message.userId === user._id ? "my-message" : ""
      } ${otherUserReadMessage ? "message-is-not-read" : ""}`}
    >
      <div className="message-wrapper" data-id={message._id}>
        <div className="message-info">
          <div className="message-text">
            <div className="single-message-text">
              {message.type === "image" ? (
                <img
                  className="chat-message-image"
                  src={message.message}
                  alt="chat-message"
                />
              ) : (
                message.message
              )}
            </div>
          </div>
          <div className="message-user-avatar">
            <img
              src={userFrom.avatar ? userFrom.avatar : defaultAvatar}
              alt="avatar"
            />
          </div>
        </div>
        <div className="message-date">
          <div className="single-message-date">
            {message.updatedAt
              ? `Edited ${moment(message.updatedAt).format(
                  "HH:mm:ss DD/MM/YYYY"
                )}`
              : moment(message.createdAt).format("HH:mm:ss DD/MM/YYYY")}
          </div>
        </div>

        <LikeButton
          onClick={handleLikeMessage}
          isLiked={message.likedBy.find(i => i === user._id)}
          likesLength={message.likedBy.length}
        />
      </div>
    </div>
  );
};

function LikeButton({ onClick, isLiked, likesLength }) {
  return (
    <div className="user-like-btn">
      <FaHeart
        id="likeIcon"
        className={`${isLiked ? "message-is-liked" : ""}`}
        onClick={onClick}
      />
      <span>{likesLength}</span>
      {/* <Tooltip
        placement="right"
        isOpen={true}
        target="likeIcon"
        toggle={() => {}}
      >
        Hello world!
      </Tooltip> */}
    </div>
  );
}

export default ChatMessage;
