import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = ({ socket }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Registration successfull. welcome!");
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Register in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        className="username__input"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />
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
      <button className="home__cta">SIGN UP</button>
      <a style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
        login
      </a>
    </form>
  );
};

export default Register;
