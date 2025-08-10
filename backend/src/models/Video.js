const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['entertainment', 'education', 'sports', 'music', 'comedy', 'lifestyle', 'news', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isMonetized: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'zh-CN'
  },
  videoType: {
    type: String,
    enum: ['short', 'long'],
    default: 'short'
  }
}, {
  timestamps: true
});

// 索引优化
videoSchema.index({ creator: 1, createdAt: -1 });
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ title: 'text', description: 'text' });

// 虚拟字段：点赞数
videoSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// 虚拟字段：评论数
videoSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// 确保虚拟字段被序列化
videoSchema.set('toJSON', { virtuals: true });
videoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Video', videoSchema);
