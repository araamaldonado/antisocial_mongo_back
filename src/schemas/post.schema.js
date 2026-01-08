const Joi = require("joi");

// Validador para ObjectId de MongoDB
const mongoIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Debe ser un ID de MongoDB válido de 24 caracteres",
    "any.required": "El ID es obligatorio",
  });

const postSchema = Joi.object({
  texto: Joi.string().trim().max(140).required().messages({
    "string.empty": "El texto no puede estar vacio",
    "string.max": "El texto debe tener como maximo 140 caracteres",
    "any.required": "El atributo texto tiene que existir",
  }),
  tags: Joi.array().items(mongoIdSchema).optional().messages({
    "array.base": "Tags debe ser un array de IDs",
    "string.pattern.base": "Cada tag debe ser un ID de MongoDB válido",
  })
});

module.exports = postSchema;