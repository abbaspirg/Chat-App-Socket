import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ChatPage from "./components/ChatPage";
import socketIO from "socket.io-client";
import Register from "./components/Register";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";

const socket = socketIO.connect("http://localhost:4000");
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<Login socket={socket} />}></Route>
          <Route
            path="/register"
            element={<Register socket={socket} />}
          ></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
          <Route path="/" element={<Navigate to="/login" />}></Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
