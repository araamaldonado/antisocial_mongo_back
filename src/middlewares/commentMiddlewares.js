const { Comment } = require("../models/comment");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const commentSchema = require("../schemas/comment.schema");
const validarById = require("./generic.middleware");

// Verifica si existe el comentario
const validarCommentId = validarById(Comment);

const validarSchemaComment = (req, res, next) => {
  const { error } = genericSchemaValidator(commentSchema, req.body);
  if (error) {
    return res.status(400).json({
      errores: error.details.map((e) => ({
        atributo: e.path.join("."),
        detalle: e.message
      }))
    });
  }
  next();
};

module.exports = {
  validarCommentId,
  validarSchemaComment,
};