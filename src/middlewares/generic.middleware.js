const validarById = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id;
    const instance = await modelo.findById(id);

    if (!instance) {
      res.status(404).json({ error_message: `El id ${id} no fue encontrado` });
      return;
    }
    next();
  };
};

module.exports = validarById;