import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLoginButton } from "react-social-login-buttons";

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
        localStorage.setItem("userName", data.name);
        socket.emit("newUser", { userName: data.name, socketID: socket.id });
        navigate("/chat");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log("codeResponse", codeResponse);
      const { data } = await axios.post("/googleOuuth", codeResponse);
      toast.success("Login successfull. welcome!");
      setUser(data);
      localStorage.setItem("userName", data.name);
      socket.emit("newUser", { userName: data.name, socketID: socket.id });
      navigate("/chat");
    },
  });

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
      <GoogleLoginButton
        onClick={() => GoogleLogin()}
        style={{ width: "230px" }}
      />
      <a style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
        Register
      </a>
    </form>
  );
};

export default Login;
