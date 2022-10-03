const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login, logout, checkCookieWithToken } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validate');
const NotFoundError = require('../errors/NotFoundError');

router.get('/checkcookie', checkCookieWithToken); 
router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);
router.get('/signout', auth, logout);

router.use('/', auth, require('./users'));
router.use('/', auth, require('./movies'));

router.use('*', auth, () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
