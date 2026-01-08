const Joi = require("joi");

const commentSchema = Joi.object({
  texto: Joi.string()
    .trim()
    .min(1)
    .max(140)
    .required()
    .messages({
      "string.empty": "El texto no puede estar vacío",
      "string.min": "El comentario debe tener al menos 1 carácter",
      "string.max": "El comentario debe tener como máximo 140 caracteres",
      "any.required": "El atributo 'texto' tiene que existir",
    }),

  user: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "El campo 'user' es obligatorio",
      "string.length": "El campo 'user' debe ser un ObjectId válido",
      "any.required": "El atributo 'user' tiene que existir",
    }),

  post: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "El campo 'post' es obligatorio",
      "string.length": "El campo 'post' debe ser un ObjectId válido",
      "any.required": "El atributo 'post' tiene que existir",
    }),

  visible: Joi.boolean().optional(),
});

module.exports = commentSchema;