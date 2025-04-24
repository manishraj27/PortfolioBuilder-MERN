const Portfolio = require('../models/Portfolio');

const createPortfolio = async (req, res) => {
  try {
    const portfolio = new Portfolio({
      ...req.body,
      user: req.user._id
    });
    await portfolio.save();
    
    // Add portfolio to user's portfolios array
    req.user.portfolios.push(portfolio._id);
    await req.user.save();
    
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'components', 'theme', 'isPublished', 'slug']; // Added 'slug'
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    updates.forEach(update => portfolio[update] = req.body[update]);
    await portfolio.save();
    
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Remove portfolio from user's portfolios array
    req.user.portfolios = req.user.portfolios.filter(id => id.toString() !== req.params.id);
    await req.user.save();

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this new controller method
const getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      slug: req.params.slug,
      isPublished: true
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to module.exports
module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio 
};