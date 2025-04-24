const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Apply both auth and adminAuth middleware
router.use(auth);
router.use(adminAuth);

// Admin routes
router.get('/users', adminController.getAllUsers);

module.exports = router;