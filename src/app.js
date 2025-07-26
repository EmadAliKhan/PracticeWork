import express, { urlencoded } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
const app = express();
// const cookieParser = require("cookie-parser");
// import cookieParser from "cookie-parser";

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// const nodemailer = require("nodemailer");

import MultipleImagesRouter from "./routes/MultipleImages.route.js";
import userRouter from "./routes/User.route.js";
import emailRouter from "./routes/SendEmail.route.js";
import cookieParser from "cookie-parser";

app.use("/api/v1", MultipleImagesRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", emailRouter);

export { app };
