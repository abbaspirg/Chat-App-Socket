import React, {useState} from 'react'
import { IoSendSharp } from "react-icons/io5";
import checkPageStatus from "../utils/functions"

const ChatFooter = ({socket}) => {
    const [message, setMessage] = useState("")
    const handleTyping = () => socket.emit("typing",`${localStorage.getItem("userName")} is typing [${message}]`)
    const handleTypingOut = () => socket.emit("typing", "")

    const handleSendMessage = (e) => {
        e.preventDefault()
        if(message.trim() && localStorage.getItem("userName")) {
        socket.emit("message", 
            {
            text: message, 
            name: localStorage.getItem("userName"), 
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id
            }
        )
        checkPageStatus(message, localStorage.getItem("userName")) 
        }
        setMessage("")
    }

  return (
    <div className='chat__footer'>
        <form className='form' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder='Write message' 
            className='message' 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            onKeyUp={handleTypingOut}
            />
            <button className="sendBtn"><IoSendSharp/></button>
        </form>
     </div>
  )
}

export default ChatFooter