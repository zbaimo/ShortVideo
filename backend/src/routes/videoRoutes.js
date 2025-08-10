const express = require('express');
const router = express.Router();
const {
  getRecommendedVideos,
  getShortVideos,
  getLongVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  toggleVideoLike,
  searchVideos
} = require('../controllers/videoController');
const { protect, optionalAuth } = require('../middleware/auth');

// 公开路由
router.get('/recommended', optionalAuth, getRecommendedVideos);
router.get('/short', optionalAuth, getShortVideos);
router.get('/long', optionalAuth, getLongVideos);
router.get('/search', optionalAuth, searchVideos);
router.get('/:id', optionalAuth, getVideoById);

// 需要认证的路由
router.post('/', protect, uploadVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/like', protect, toggleVideoLike);

module.exports = router;
