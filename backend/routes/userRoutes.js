const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);

module.exports = router;