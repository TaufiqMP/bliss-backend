const express = require("express");
const router = express.Router();
const AuthController = require("./auth-controller");
const { validateRegister, validateLogin } = require("./auth-validators");
const authUser = require("../../middleware/auth");

router.post("/register", validateRegister, AuthController.register);
router.post("/login", validateLogin, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/verify", authUser, AuthController.verify);



module.exports = router;

