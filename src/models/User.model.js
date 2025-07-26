import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
// import JWT from "jsonwebtoken";

// const JWT = require("jsonwebtoken");
import JWT from "jsonwebtoken";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//if the password is bcrypt then move to next if not then bcrypt it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Compare the Given password and the database password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generating Access Token
userSchema.methods.generateAccessToken = function () {
  return JWT.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET, //Token secret
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, //Token Expires Time
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return JWT.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("user", userSchema);
