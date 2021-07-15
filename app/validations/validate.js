module.exports = {

  validateBody: function (schema) {

    return (request, response, next) => {

      const { error } = schema.validate(request.body);

      if (error) {
        response.status(400).json(error.details.map(detail => detail.message));
        return;
      }

      next();
    };
  }
};