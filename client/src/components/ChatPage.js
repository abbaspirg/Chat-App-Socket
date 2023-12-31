import React, { useEffect, useState, useRef } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [isChatBarOpen, setIsChatBarOpen] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChatBar = () => {
    setIsChatBarOpen((prev) => !prev);
  };

  const closeChatBar = () => {
    setIsChatBarOpen(false);
  };

  return (
    <div className="chat">
      <div
        className={`chat__overlay ${isChatBarOpen ? "visible" : ""}`}
        onClick={closeChatBar}
      ></div>
      <div
        className={`chat__icon ${isChatBarOpen ? "hidden" : ""}`}
        style={{ display: isChatBarOpen ? "none" : "" }}
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
      <ChatBar socket={socket} isOpen={isChatBarOpen} />
      <div className="chat__main">
        <ChatBody
          isChatBarOpen={isChatBarOpen}
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
        />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
