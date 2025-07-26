import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/AsyncHandler.js";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});
const EmailSender = asyncHandler(async (req, res) => {
  const info = await transporter.sendMail({
    from: '" 👻" <emadalikhan5@gmail.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  console.log("Message sent: %s", info.messageId);
});

export { EmailSender };
