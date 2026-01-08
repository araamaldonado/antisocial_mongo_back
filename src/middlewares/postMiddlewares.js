const { Post } = require("../models/post");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const postSchema = require("../schemas/post.schema");
const postTagImageSchema = require("../schemas/post-tag-images.Schema");
const validarById = require("./generic.middleware");
const { User } = require("../models/user");

const validarPostId = validarById(Post);
const validarUserId = validarById(User);

const validarSchemaPost = (req, res, next) => {
  const { error } = genericSchemaValidator(postSchema, req.body);
  if (error) {
    return res.status(400).json({
      errores: error.details.map((e) => ({
        atributo: e.path.join("."),
        detalle: e.message,
      })),
    });
  }
  next();
};

const validarSchemaPostTagImage = (req, res, next) => {
  const { error, _ } = genericSchemaValidator(postTagImageSchema, req.body);
  if (error) {
    return res.status(400).json({
      errores: error.details.map((e) => ({
        atributo: e.path.join("."),
        detalle: e.message,
      })),
    });
  }
  next();
};

module.exports = {
  validarPostId,
  validarUserId,
  validarSchemaPost,
  validarSchemaPostTagImage,
};