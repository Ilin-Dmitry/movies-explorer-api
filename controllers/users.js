const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

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

module.exports.refreshUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user && (user._id.toString() !== req.user._id)) {
        throw new ConflictError('Пользователь с такой почтой уже зарегестрирован');
      }
      User.findByIdAndUpdate(req.user._id, { name, email }, {
        new: true,
        runValidators: true,
      })
        .then((refreshedUser) => {
          res.send(refreshedUser);
        });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ name, email, password: hash })
            .then((userData) => {
              res.status(201)
                .send({ name: userData.name, email: userData.email, _id: userData._id });
            });
        });
    })
    .catch(next);
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

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('token').send({ message: 'Вы успешно вышли из аккаунта' });
  } catch (err) {
    next(err);
  }
};

module.exports.checkCookieWithToken = (req, res) => {
  if (!req.cookies.token) {
    return res.send('false');
  }
  return res.send('true');
};
