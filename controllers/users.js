const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.showMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.refreshUser = (req, res) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send(user);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new Error('Пользователь с таким email уже зарегестрирован'));
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ name, email, password: hash })
            .then((userData) => {
              res.status(201)
                .send({ name: userData.name, email: userData.email, _id: userData._id });
            });
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        // sameSite: 'none',
        // secure: true,
      }).send({ name: user.name, email: user.email, _id: user._id });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Вы успешно вышли из аккаунта' });
};
