const celebrate = require('celebrate');
const BadRequestError = require('./BadRequestError');

const handleCelebrateError = (err, req, res, next) => {
  if (celebrate.isCelebrateError(err)) {
    const joiMessage = err.details.get('body').message;
    throw new BadRequestError(`Переданы неверные данные. ${joiMessage}`);
  }
  next();
};

module.exports = { handleCelebrateError };
