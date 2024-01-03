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

  useEffect(()=> {
    function fetchMessages() {
      fetch("http://localhost:4000/api")
      .then(response => response.json())
      .then(data => setMessages(data.messages))
    }
    fetchMessages()
}, [])

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
      
      <ChatBar socket={socket} isOpen={isChatBarOpen} />
      <div className="chat__main">
        <ChatBody
          isChatBarOpen={isChatBarOpen}
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          toggleChatBar={toggleChatBar}
        />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
