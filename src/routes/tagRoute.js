const express = require("express");
const router = express.Router();

// Middleware
const {
  existTag,
  validarSchemaTag,
  validarTagId,
} = require("../middlewares/tagMiddlewares");

// Controladores
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

router.get("/", getTags);
router.get("/:id", validarTagId, getTagById);
router.post("/", validarSchemaTag, existTag, createTag);
router.put("/:id", validarTagId, validarSchemaTag, existTag, updateTag);
router.delete("/:id", validarTagId, deleteTag);

module.exports = router;