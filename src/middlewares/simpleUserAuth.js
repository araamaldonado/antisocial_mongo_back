const simpleUserAuth = (req, res, next) => {
  // 1. Obtener el ID del usuario de la cabecera personalizada 'x-user-id'
  // Express convierte los nombres de las cabeceras a minúsculas.
  const userIdFromHeader = req.headers["x-user-id"];

  // 2. Validación: Asegurar que se haya enviado el ID
  if (!userIdFromHeader) {
    // En un entorno de prueba, es mejor devolver un 400 o 401
    return res.status(401).json({
      message:
        'Acceso denegado. Se requiere el Header "X-User-ID" para la simulación de autenticación.',
    });
  }

  // 3. Inyectar el ID en req.user
  // Aseguramos que el ID sea un número entero (aunque se envíe como string en el header)
  const userId = parseInt(userIdFromHeader, 10);

  // 4. Se comprueba que el ID sea un número válido y positivo
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      message: 'El valor de "X-User-ID" debe ser un número de usuario válido.',
    });
  }

  // El objeto 'req.user' ahora contiene la identidad del creador
  req.user = {
    id: userId,
  };

  // 5. Continuar al siguiente middleware o al controlador
  next();
};

module.exports = simpleUserAuth;