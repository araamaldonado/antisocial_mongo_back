const express = require("express");
const router = express.Router();
const {
  existUserName,
  validarSchemaUser,
  validarUserById,
  validarUserByNickname,
  existMail,
} = require("../middlewares/userMiddlewares");
const {
  getUser,
  getUserById,
  getUserByNickname,
  createUser,
  updateUser,
  deleteUser,
  logearUser
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authJwtMiddleware");

router.get("/", getUser);
router.get("/:id", validarUserById, getUserById);
router.post("/login", logearUser);  // FALTA MIDDLEWARE, SEPARA RESPONSABILIDADES

router.get("/profile/:nickname", verifyToken, validarUserByNickname, getUserByNickname);

router.post("/", validarSchemaUser, existMail, existUserName, createUser);
router.put("/:id", verifyToken,validarUserById, existUserName, updateUser);
router.delete("/:id", verifyToken,validarUserById, deleteUser);

module.exports = router;