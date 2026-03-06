const express = require("express");
const router = express.Router();

const {
  getPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  deleteImage,
  addImage,
  addTag,
} = require("../controllers/postController");

const {
  validarSchemaPost,
  validarPostId,
  validarUserId,
  validarSchemaPostTagImage,
} = require("../middlewares/postMiddlewares");

const { verifyToken } = require("../middlewares/authJwtMiddleware");

router.get("/", verifyToken, getPosts);
router.get("/user/:id", verifyToken, validarUserId, getPostsByUserId);
router.get("/:id", validarPostId, getPostById);
router.post("/", verifyToken, validarSchemaPostTagImage, createPost);
router.put("/:id", verifyToken, validarPostId, validarSchemaPost, updatePost);
router.delete("/:id", verifyToken, validarPostId, deletePost);

//Borrar imagen de post
router.delete("/:id/image/:imageId", validarPostId, deleteImage);
//agregar imagen a post
router.put("/:id/addImage/", validarPostId, addImage);
//Asociar tag a post
router.put("/:id/addTag", validarPostId, addTag);

module.exports = router;