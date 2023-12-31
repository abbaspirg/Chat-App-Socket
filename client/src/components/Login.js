import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";

const Login = ({ socket }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Login successfull. welcome!");
        setEmail("");
        setPassword("");
        setUser(data);
        navigate("/chat");
      }
    } catch (err) {
      console.log(err);
    }
    localStorage.setItem("userName", email);
    socket.emit("newUser", { email, socketID: socket.id });
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        className="username__input"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        minLength={6}
        name="password"
        id="password"
        className="username__input"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="home__cta">SIGN IN</button>
      <a style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
        Register
      </a>
    </form>
  );
};

export default Login;
