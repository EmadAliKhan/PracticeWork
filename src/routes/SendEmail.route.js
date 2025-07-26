import { Router } from "express";
import { EmailSender } from "../controllers/SendingEmail.controller.js";

const router = Router();

router.route("/sendemial").post(EmailSender);

export default router;
