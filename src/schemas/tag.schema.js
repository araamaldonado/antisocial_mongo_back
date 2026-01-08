const Joi = require("joi");

const tagObject = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "string.empty": "El nombre no puede estar vacío",
    "any.required": "El atributo 'nombre' tiene que existir",
  })
});

const tagSchema = Joi.alternatives().try(
  tagObject,
  Joi.array().items(tagObject)
);

module.exports = tagSchema;