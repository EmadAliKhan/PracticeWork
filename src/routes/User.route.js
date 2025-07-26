import { Router } from "express";
import {
  LoginUser,
  LogOutUser,
  RegisterUser,
} from "../controllers/user.controller.js";
import { VerifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/signUp").post(RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(VerifyJWT, LogOutUser);

export default router;
