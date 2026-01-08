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

router.get("/", getComments);
router.get("/:id", validarCommentId, getCommentById);
router.post("/", validarSchemaComment, createComment);
router.put("/:id", validarCommentId, validarSchemaComment, updateComment);
router.delete("/:id", validarCommentId, deleteComment);

module.exports = router;