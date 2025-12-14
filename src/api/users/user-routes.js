const express = require("express");
const router = express.Router();
const multer = require('multer');
const UsersController = require("./user-controller");
const authUser = require("../../middleware/auth");
// const middleware = require("../../middleware/authMiddleware");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas 2MB
});

router.get("/", UsersController.getSales);

router.get("/top-three", UsersController.getTopThree);

router.put("/update", authUser, UsersController.updateProfile);

router.get("/:user_id", authUser, UsersController.getUsersById);
router.put("/:user_id", authUser, UsersController.putUsersById);
router.delete("/:user_id", authUser, UsersController.deleteUsersById);
router.post("/upload/:user_id", authUser, upload.single('profileImage'), UsersController.uploadProfile);


module.exports = router;

