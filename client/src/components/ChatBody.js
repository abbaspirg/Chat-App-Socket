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
        <p style={{ marginLeft: isChatBarOpen ? "" : "40px" }}>
          Hangout with Colleagues
        </p>
        <div style={{ alignItems: "center", display: "flex" }}>
          <p>{user?.name}</p>
          <button className="leaveChat__btn" onClick={handleLeaveChat}>
            <IoMdExit />
          </button>
        </div>
      </header>

      <div className="message__container">
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
      </div>
    </>
  );
};

export default ChatBody;
