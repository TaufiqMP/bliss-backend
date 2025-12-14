const express = require("express");
const router = express.Router();
const multer = require('multer');
const UsersController = require("../controllers/user-controller");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas 2MB
});

router.get("/data", UsersController.getSales);
router.get("/data/:user_id", UsersController.getUsersById);
router.put("/update/:user_id", UsersController.putUsersById);
router.delete("/delete/:user_id", UsersController.deleteUsersById);
router.post("/upload/:user_id", upload.single('profileImage'), UsersController.uploadProfile);

module.exports = router;

