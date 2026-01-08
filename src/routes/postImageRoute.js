const express = require("express");
const router = express.Router();

const {
  createPostImage,
  getPostImages,
  getPostImageById,
  updatePostImage,
  deletePostImage,
} = require("../controllers/postImageController");

const {
  validarSchemaPostImage,
  validarPostImageId,
} = require("../middlewares/post_ImageMiddlewares");

router.get("/", getPostImages);
router.get("/:id", validarPostImageId, getPostImageById);
router.post("/", validarSchemaPostImage, createPostImage);
router.put("/:id", validarPostImageId, validarSchemaPostImage, updatePostImage);
router.delete("/:id", validarPostImageId, deletePostImage);

module.exports = router;