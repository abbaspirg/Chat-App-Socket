const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const PORT = 4000;
const Io = require("socket.io");
const fs = require('fs');
const rawData = fs.readFileSync('messages.json');
const messagesData = JSON.parse(rawData);
const server = http.createServer(app);

const socketIO = Io(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(`Database not connected ${err}`);
  });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("message", data => {
    messagesData["messages"].push(data)
    const stringData = JSON.stringify(messagesData, null, 2)
    fs.writeFile("messages.json", stringData, (err)=> {
      console.error(err)
    })
    socketIO.emit("messageResponse", data)
  })

  
  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", require("./routes/authRoutes"));
app.get("/profile", require("./routes/authRoutes"));
app.post("/register", require("./routes/authRoutes"));
app.post("/login", require("./routes/authRoutes"));
app.post("/logout", require("./routes/authRoutes"));
app.post("/googleOuuth", require("./routes/authRoutes"));

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//fRpwpk8NxmycOuwa
