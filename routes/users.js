const router = require('express').Router();
const { showMe, refreshUser } = require('../controllers/users');

router.get('/users/me', showMe);
router.patch('/users/me', refreshUser);
