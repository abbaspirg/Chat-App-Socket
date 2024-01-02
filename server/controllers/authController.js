const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const api = (req, res) => {
  res.json({ message: "Hello" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      res.json({
        error: "Name is required",
      });
    }
    if (!password || password.length < 6) {
      res.json({
        error: "Password is required and should be atleast 6 characters long",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      res.json({
        error: "Email is taken already",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        error: "No user found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (match) {
      // res.json("login successfull");
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res
            .cookie("token", token, { sameSite: "None", secure: true })
            .json(user);
        }
      );
    } else {
      res.json({
        error: "Password do not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const googleOuth = async (req, res) => {
  const { access_token } = req.body;

  const url = "https://www.googleapis.com/oauth2/v1/userinfo";

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
  };

  try {
    const response = await axios.get(url, { headers });
    const { name, email, id } = response.data;
    const user = await User.findOne({ email });
    if (user) {
      const match = await comparePassword(id, user.password);
      if (match) {
        jwt.sign(
          { email: user.email, id: user._id, name: user.name },
          process.env.JWT_SECRET,
          {},
          (error, token) => {
            if (error) throw error;
            res
              .cookie("token", token, { sameSite: "None", secure: true })
              .json(user);
          }
        );
      }
      else{
        res.json({
          error: "Something went wrong",
        });
      }
    } else {
      const hashedPassword = await hashPassword(id);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res
            .cookie("token", token, { sameSite: "None", secure: true })
            .json(user);
        }
      );
    }
  } catch (error) {
    console.error(
      "Error making Google API request:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Failed to fetch user info from Google API" });
  }
};

const logoutUser = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    const invalidToken = jwt.sign({ invalidated: true }, "your-secret-key", {
      expiresIn: "1s",
    });
    res.cookie("token", invalidToken, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });
    res.json(null);
  } else {
    res.json(null);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (error, user) => {
      if (error) throw error;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = {
  api,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  googleOuth,
};
