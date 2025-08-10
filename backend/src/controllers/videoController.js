const Video = require('../models/Video');
const User = require('../models/User');

// @desc    获取推荐视频
// @route   GET /api/videos/recommended
// @access  Public
const getRecommendedVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 简单的推荐算法：按观看次数和点赞数排序
    const videos = await Video.find({ isPublic: true })
      .populate('creator', 'username avatar isVerified')
      .sort({ 
        views: -1, 
        likeCount: -1, 
        createdAt: -1 
      })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({ isPublic: true });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    console.error('Get recommended videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    获取短视频
// @route   GET /api/videos/short
// @access  Public
const getShortVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ 
      isPublic: true, 
      videoType: 'short' 
    })
      .populate('creator', 'username avatar isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({ 
      isPublic: true, 
      videoType: 'short' 
    });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    console.error('Get short videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    获取长视频
// @route   GET /api/videos/long
// @access  Public
const getLongVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ 
      isPublic: true, 
      videoType: 'long' 
    })
      .populate('creator', 'username avatar isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({ 
      isPublic: true, 
      videoType: 'long' 
    });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    console.error('Get long videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    获取单个视频
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('creator', 'username avatar isVerified followers')
      .populate('comments');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // 增加观看次数
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    上传视频
// @route   POST /api/videos
// @access  Private
const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, tags, videoType } = req.body;

    // 这里应该处理文件上传，暂时使用模拟数据
    const video = await Video.create({
      title,
      description,
      videoUrl: req.body.videoUrl || 'https://example.com/video.mp4',
      thumbnailUrl: req.body.thumbnailUrl || 'https://example.com/thumbnail.jpg',
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      videoType: videoType || 'short',
      creator: req.user._id
    });

    // 更新用户的视频列表
    await User.findByIdAndUpdate(req.user._id, {
      $push: { videos: video._id }
    });

    const populatedVideo = await Video.findById(video._id)
      .populate('creator', 'username avatar isVerified');

    res.status(201).json(populatedVideo);
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    更新视频
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // 检查是否是视频创建者
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, category, tags, isPublic } = req.body;

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags ? tags.split(',').map(tag => tag.trim()) : video.tags;
    video.isPublic = isPublic !== undefined ? isPublic : video.isPublic;

    const updatedVideo = await video.save();

    const populatedVideo = await Video.findById(updatedVideo._id)
      .populate('creator', 'username avatar isVerified');

    res.json(populatedVideo);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    删除视频
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // 检查是否是视频创建者
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Video.findByIdAndDelete(req.params.id);

    // 从用户的视频列表中移除
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { videos: req.params.id }
    });

    res.json({ message: 'Video removed' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    点赞/取消点赞视频
// @route   POST /api/videos/:id/like
// @access  Private
const toggleVideoLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const isLiked = video.likes.includes(req.user._id);

    if (isLiked) {
      // 取消点赞
      video.likes = video.likes.filter(id => id.toString() !== req.user._id.toString());
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likes: req.params.id }
      });
    } else {
      // 点赞
      video.likes.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likes: req.params.id }
      });
    }

    await video.save();

    res.json({ 
      message: isLiked ? 'Video unliked' : 'Video liked',
      likeCount: video.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('Toggle video like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    搜索视频
// @route   GET /api/videos/search
// @access  Public
const searchVideos = async (req, res) => {
  try {
    const { q, category, videoType } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    if (videoType) {
      query.videoType = videoType;
    }

    const videos = await Video.find(query)
      .populate('creator', 'username avatar isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    console.error('Search videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRecommendedVideos,
  getShortVideos,
  getLongVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  toggleVideoLike,
  searchVideos
};
