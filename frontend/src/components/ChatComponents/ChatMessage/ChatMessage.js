import React, { useState, useEffect } from "react";
import { Tooltip } from "reactstrap";
import { FaHeart } from "react-icons/fa";
import moment from "moment";

import ImagePreview from "../../../components/ImagePreview/ImagePreview";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import { socket } from "../../../pages/DashboardContainer/DashboardContainer";
import "./chat-message.scss";

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
        !message.likedBy.find(i => i._id === user._id)
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
                <ImagePreview
                  className="chat-message-image"
                  src={message.message}
                  alt="chat-message"
                />
              ) : (
                message.message
              )}
            </div>
          </div>
          <div
            className="message-user-avatar"
            style={{
              background: `url('${userFrom.avatar || defaultAvatar}')`,
            }}
          />
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
          isLiked={message.likedBy.find(i => i._id === user._id)}
          likesLength={message.likedBy.length}
          messageId={message._id}
          tooltipPlacement={message.userId === user._id ? "left" : "right"}
          users={message.likedBy}
        />
      </div>
    </div>
  );
};

const tooltipDelay = {
  show: 150,
  hide: 250,
};

const LikeButton = ({
  onClick,
  isLiked,
  likesLength,
  messageId,
  tooltipPlacement,
  users,
}) => {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const toggleTooltip = () => {
    setTooltipIsOpen(!tooltipIsOpen);
  };

  return (
    <div className="user-like-btn">
      <FaHeart
        id={`likeIcon-${messageId}`}
        className={`${isLiked ? "message-is-liked" : ""}`}
        onClick={onClick}
      />
      <span>{likesLength}</span>

      {users.length > 0 && (
        <Tooltip
          placement={tooltipPlacement}
          isOpen={tooltipIsOpen}
          target={`likeIcon-${messageId}`}
          toggle={toggleTooltip}
          autohide={false}
          delay={tooltipDelay}
        >
          <div className="like-tooltip-container">
            {users.map(user => (
              <div className="user-liked-message" key={user._id}>
                <div
                  className="user-like-avatar"
                  style={{
                    background: `url('${user.avatar || defaultAvatar}')`,
                  }}
                />
                <div className="user-liked-login">{user.login}</div>
              </div>
            ))}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default ChatMessage;
