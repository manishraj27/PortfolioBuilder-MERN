const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate({
        path: 'portfolios',
        select: 'title slug isPublished'
      });

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      publishedPortfolios: user.portfolios
        .filter(p => p.isPublished)
        .map(portfolio => ({
          id: portfolio._id,
          title: portfolio.title,
          slug: portfolio.slug,
          url: `/portfolio/${portfolio.slug}`
        }))
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers
};