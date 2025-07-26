import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import JWT from "jsonwebtoken";
const GenerateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = user.generateAccessToken(); //generate access token
    const RefreshToken = user.generateRefreshToken(); //generate refresh token
    user.refreshToken = RefreshToken;
    user.save({ validateBeforeSave: true });
    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token.."
    );
  }
};

const RegisterUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  try {
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

    const user = User.create({
      userName,
      email,
      password,
    });

    //Not sending the password and email to the databse
    const createdUser = User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        400,
        "something went wrong while registering the user"
      );
    }

    const { AccessToken, RefreshToken } = GenerateAccessAndRefreshToken(
      user._id
    );
    const options = {
      http: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("accessToken", AccessToken, options)
      .cookie("refreshToken", RefreshToken, options)
      .json(new ApiResponse(200, createdUser, "User Created successfully."));
  } catch (error) {
    throw new ApiError(500, "Internal server error while creating User.");
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required..");
  }

  const userLogin = await User.findOne({
    $or: [{ email }, { password }],
  });

  if (!userLogin) {
    throw new ApiError(400, "User doesn't exist..");
  }

  const isPasswordValid = await userLogin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Password..");
  }

  const { AccessToken, RefreshToken } = GenerateAccessAndRefreshToken(
    userLogin._id
  );

  const options = {
    http: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options);
});

const LogOutUser = asyncHandler(async (req, res) => {
  await User.findById(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    http: true,
    secure: true,
  };

  return res
    .status(200)
    .clearcookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "UserLogged Out successfully"));
});

const RefreshAccessToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken =
    req.cookie?.refreshToken || req.body?.refreshToken;
  if (!IncomingRefreshToken) {
    req.status(401).json({
      message: "unauthorized request...",
    });
  }
  const decodeToken = JWT.verify(
    IncomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = User.findById(decodeToken._id);
  if (!user) {
    req.status(401).json({
      message: "invalid refresh token...",
    });
  }

  if (decodeToken !== user.refreshToken) {
    req.status(401).json({
      message: "Refresh Token is expired or used...",
    });
  }

  // Generating new refreshToken
  const options = {
    httpOnly: true,
    secure: true,
  };

  const { AccessToken, newRefreshToken } = GenerateAccessAndRefreshToken(
    user.id
  );
  return res
    .status(200)
    .cookie("accessToken", AccessToken)
    .cookie("refreshToken", newRefreshToken)
    .json("Access Token refresh Successfully");
});

export { RegisterUser, LoginUser, LogOutUser, RefreshAccessToken };
