require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/connection');
const userRoutes = require('./routes/userRoutes')
const portfolioRoutes = require('./routes/portfolioRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);

// Add admin routes
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});