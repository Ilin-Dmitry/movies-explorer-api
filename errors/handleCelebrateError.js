const celebrate = require('celebrate');
const BadRequestError = require('./BadRequestError');

const handleCelebrateError = (err, req, res, next) => {
  if (celebrate.isCelebrateError(err)) {
    const body = err.details.get('body');
    const params = err.details.get('params');
    const joiMessage = (body || params).message;
    throw new BadRequestError(`Переданы неверные данные. ${joiMessage}`);
  }
  next(err);
};

module.exports = { handleCelebrateError };
