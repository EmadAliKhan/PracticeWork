import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
const SignUp = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new ApiError(400, "All fields are required..");
  }

  //checking the existed user
  const existedUser = User.findOne({
    $or: [{ email }, { password }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "user with this email and password already exists...."
    );
  }

  //encrypted password
  const myEncryptedPassword = await bcrypt.hash(password, 10);

  //save the user in DB
  const user = User.create({
    userName,
    email,
    password: myEncryptedPassword,
  });

  // generate Token
  const Token = JWT.sign({ id: user._id, email }, process.env.TOKENSECRET, {
    expiresIn: "2h",
  });

  user.Token = Token;
  user.password = undefined;

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Created successfully."));
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new ApiError(400, "All fields are required..");
  }

  const user = await User.findOne({ email });
  const comparePassword = await bcrypt.compare(password, user.password);

  if (user && comparePassword) {
    const Token = JWT.sign({ id: user._id }, process.env, ACCESSTOKEN_SECRET, {
      expiresIn: "2h",
    });
    user.Token = Token;
    user.password = undefined;
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(409).cookie("token", Token, options).json({
      success: true,
      Token,
      user,
    });
  }
});

export { SignUp, Login };
