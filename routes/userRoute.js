const express = require("express");
require("dotenv").config();

const multer = require("multer");
const { register,verifyEmail,login } = require("../controllers/userController");

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" });

userRouter.post("/register", upload.single("profileImage"), register);
userRouter.get("/verify/:code", verifyEmail);
userRouter.post("/login", login);

module.exports = userRouter;



