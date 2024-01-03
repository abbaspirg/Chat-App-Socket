import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import { UserContext } from "../context/userContext";
import axios from "axios";

const ChatBody = ({
  messages,
  typingStatus,
  lastMessageRef,
  isChatBarOpen,
  toggleChatBar,
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    axios.post("logout").then((data) => {
      setUser(data);
    });
    navigate("/login");
  };

  return (
    <>
      <header className="chat__mainHeader">
      <div
        // className={`chat__icon ${isChatBarOpen ? "hidden" : ""}`}
        style={{ zIndex: isChatBarOpen ? "0" : "1" }}
        onClick={toggleChatBar}
      >
        <svg
          width="20"
          height="20"
          class="me-1"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 12h18"></path>
          <path d="M3 6h18"></path>
          <path d="M3 18h18"></path>
        </svg>
      </div>
        <p style={{ marginLeft: isChatBarOpen ? "40px" : "40px" }}>
          Hangout with Colleagues
        </p>
        <div style={{ alignItems: "center", display: "flex" }}>
          <p>{user?.name}</p>
          <button className="leaveChat__btn" onClick={handleLeaveChat}>
            <IoMdExit />
          </button>
        </div>
      </header>

      {/* <div className="message__container">
        {messages.map((message) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div> */}
      <div className="message__container">
        {messages.map((message, index) => {
          const isCurrentUser =
            message.name === localStorage.getItem("userName");
          const isFirstInGroup =
            index === 0 || messages[index - 1].name !== message.name;

          return (
            <div className="message__chats" key={message.id}>
              {isFirstInGroup && (
                <p className={isCurrentUser ? "sender__name" : ""}>
                  {isCurrentUser ? "You" : message.name}
                </p>
              )}
              <div
                className={
                  isCurrentUser ? "message__sender" : "message__recipient"
                }
              >
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
