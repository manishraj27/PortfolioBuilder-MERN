const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: function() {
      const randomString = Math.random().toString(36).substring(2, 8);
      return `${this.title.toLowerCase().replace(/\s+/g, '-')}-${randomString}`;
    }
  },
  components: [{
    type: {
      type: String,
      required: true,
      enum: ['header', 'about', 'education', 'experience', 'skills', 'projects', 'achievements', 'contact']
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  theme: {
    type: String,
    enum: ['classic', 'modern', 'minimal', 'creative'],
    default: 'classic'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedUrl: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);