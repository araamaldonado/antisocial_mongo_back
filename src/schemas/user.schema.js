const Joi = require("joi");

const userSchema = Joi.object({
  nickname: Joi.string().trim().min(5).max(30).required().messages({
    "string.empty": "El nickname no puede estar vacio",
    "any.required": "El atributo nickname tiene que existir",
  }),
  mail: Joi.string().trim().email().required().messages({
    "string.empty": "El mail no puede estar vacio",
    "string.email": "El mail debe tener un formato válido",
    "any.required": "El atributo mail tiene que existir",
  }),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener mínimo 8 caracteres",
    "string.max": "La contraseña debe tener máximo 128 caracteres",
    "string.pattern.base":
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
  })
}).options({
  allowUnknown: true, // permite otros campos como createdAt, __v, etc.
});

module.exports = userSchema;