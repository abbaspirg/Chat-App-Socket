import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../context/userContext"

const ChatBar = ({ socket, isOpen }) => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext)

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className={`chat__sidebar ${isOpen ? 'open' : ''}`}>
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users.map((user) => (
            <p key={user.socketID}>{user.userName}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
