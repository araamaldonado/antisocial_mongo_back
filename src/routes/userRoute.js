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
} = require("../controllers/userController");

router.get("/", getUser);
router.get("/:id", validarUserById, getUserById);
router.get("/login/:nickname", validarUserByNickname, getUserByNickname);
router.post("/", validarSchemaUser, existMail, existUserName, createUser);
router.put("/:id", validarUserById, existUserName, updateUser);
router.delete("/:id", validarUserById, deleteUser);

module.exports = router;