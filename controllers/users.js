const User = require('../models/user');

module.exports.showMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    });
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
