const Joi = require("joi");

const userSchema = Joi.object({
  nickname: Joi.string().required().messages({
    "string.empty": "El nickname no puede estar vacio",
    "any.required": "El atributo nickname tiene que existir",
  }),
  mail: Joi.string().trim().email().required().messages({
    "string.empty": "El mail no puede estar vacio",
    "string.email": "El mail debe tener un formato válido",
    "any.required": "El atributo mail tiene que existir",
  }),
}).options({
  allowUnknown: true, // permite otros campos como createdAt, __v, etc.
});

module.exports = userSchema;