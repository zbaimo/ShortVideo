const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getUserById
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// 公开路由
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);

// 需要认证的路由
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;
