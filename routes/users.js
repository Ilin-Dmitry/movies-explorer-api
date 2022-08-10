const router = require('express').Router();
const { showMe, refreshUser } = require('../controllers/users');
const { refreshUserValidation } = require('../middlewares/validate');

router.get('/users/me', showMe);
router.patch('/users/me', refreshUserValidation, refreshUser);

module.exports = router;
