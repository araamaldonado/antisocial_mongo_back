const express = require("express")
const router = express.Router()

const {
    getComments, 
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} = require("../controllers/commentController");

const {
    validarSchemaComment,
    validarCommentId
} = require("../middlewares/commentMiddlewares");
const { verifyToken } = require("../middlewares/authJwtMiddleware");

router.get("/", getComments);
router.get("/:id", validarCommentId, getCommentById);
router.post("/", verifyToken, validarSchemaComment, createComment);
router.put("/:id", verifyToken, validarCommentId, validarSchemaComment, updateComment);
router.delete("/:id", verifyToken, validarCommentId, deleteComment);

module.exports = router;