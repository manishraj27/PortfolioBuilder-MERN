const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middlewares/auth');

// Add this public route before the auth middleware
router.get('/public/:slug', portfolioController.getPublicPortfolio);

// Protected routes
router.use(auth);
router.post('/', portfolioController.createPortfolio);
router.get('/', portfolioController.getPortfolios);
router.get('/:id', portfolioController.getPortfolioById);
router.patch('/:id', portfolioController.updatePortfolio);
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;