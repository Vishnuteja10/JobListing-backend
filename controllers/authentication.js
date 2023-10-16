const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    console.log("req body :", req.body);
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      res.status(400).json({
        success: false,
        errorMessage: "all fields are required!",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile: phoneNumber }],
    });

    if (existingUser) {
      console.log("existing user:", existingUser);
      return res.status(400).json({
        success: false,
        errorMessage: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile: phoneNumber,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    console.log(email);
    res.json({
      success: true,
      message: "register here",
      email: user.email,
      token,
      name: user.name,
    });
  } catch (error) {
    console.log("error is", error);
    res.json({
      success: false,
      error: error,
      errorMessage: "something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("email is", email);
    console.log("password is", password);

    if (!email || !password) {
      res.status(400).json({
        success: false,
        errorMessage: "all fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    console.log("existing user", existingUser);

    if (existingUser == null) {
      res.status(400).json({
        success: false,
        errorMessage: "Invalid user or password",
      });
    } else {
      const passwordMatched = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordMatched) {
        res.status(400).json({
          success: false,
          errorMessage: "Invalid user or password",
        });
      }

      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.SECRET_KEY
      );

      res.json({
        success: true,
        message: "Login",
        token,
        existingUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error,
      errorMessage: "something went wrong",
    });
  }
};

module.exports = { register, login };
