import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { videoApi } from '../utils/api';
import { Video, Comment } from '../types';

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadVideo();
    }
  }, [id]);

  const loadVideo = async () => {
    try {
      setIsLoading(true);
      const response = await videoApi.getVideoById(id!);
      const videoData = response.data;
      setVideo(videoData);
      
      // 检查用户是否已点赞和收藏
      if (user) {
        setIsLiked(videoData.likes.includes(user._id));
        // 这里可以添加检查收藏状态的逻辑
      }
      
      // 加载评论
      setComments(videoData.comments || []);
    } catch (err: any) {
      setError(err.response?.data?.message || '加载视频失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      await videoApi.toggleLike(id!);
      setIsLiked(!isLiked);
      
      if (video) {
        setVideo({
          ...video,
          likeCount: isLiked ? video.likeCount - 1 : video.likeCount + 1,
          likes: isLiked 
            ? video.likes.filter(likeId => likeId !== user._id)
            : [...video.likes, user._id]
        });
      }
    } catch (err: any) {
      console.error('点赞失败:', err);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 这里可以添加收藏到后端的逻辑
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title || '短视频',
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    
    try {
      // 这里可以添加发送评论到后端的逻辑
      const comment: Comment = {
        _id: Date.now().toString(),
        content: newComment,
        author: user,
        video: id!,
        replies: [],
        likes: [],
        dislikes: [],
        isEdited: false,
        isDeleted: false,
        likeCount: 0,
        replyCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
      
      if (video) {
        setVideo({
          ...video,
          commentCount: video.commentCount + 1
        });
      }
    } catch (err: any) {
      console.error('发送评论失败:', err);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-red-500 mb-4">{error || '视频不存在'}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-lg font-semibold">视频</div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-16">
        {/* 视频播放器 */}
        <div className="relative w-full aspect-[9/16] bg-gray-900">
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover"
            poster={video.thumbnailUrl}
            onClick={togglePlayPause}
            muted={isMuted}
            loop
          />
          
          {/* 播放控制按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </button>
            )}
          </div>

          {/* 右侧操作按钮 */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
            {/* 点赞按钮 */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center space-y-1"
            >
              <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white bg-opacity-20'} backdrop-blur-sm`}>
                <Heart size={24} className={isLiked ? 'fill-white text-white' : 'text-white'} />
              </div>
              <span className="text-sm">{video.likeCount}</span>
            </button>

            {/* 评论按钮 */}
            <button className="flex flex-col items-center space-y-1">
              <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                <MessageCircle size={24} className="text-white" />
              </div>
              <span className="text-sm">{video.commentCount}</span>
            </button>

            {/* 分享按钮 */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center space-y-1"
            >
              <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                <Share2 size={24} className="text-white" />
              </div>
              <span className="text-sm">{video.shares}</span>
            </button>

            {/* 收藏按钮 */}
            <button
              onClick={handleBookmark}
              className="flex flex-col items-center space-y-1"
            >
              <div className={`p-3 rounded-full ${isBookmarked ? 'bg-yellow-500' : 'bg-white bg-opacity-20'} backdrop-blur-sm`}>
                <Bookmark size={24} className={isBookmarked ? 'fill-white text-white' : 'text-white'} />
              </div>
            </button>
          </div>

          {/* 底部视频信息 */}
          <div className="absolute bottom-4 left-4 right-20">
            <div className="mb-2">
              <span className="text-sm font-semibold">@{video.creator.username}</span>
            </div>
            <div className="mb-2">
              <p className="text-sm">{video.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-300">{video.category}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-300">{video.views} 次观看</span>
            </div>
          </div>
        </div>

        {/* 评论区域 */}
        <div className="bg-gray-900 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">评论 ({video.commentCount})</h3>
          </div>

          {/* 发表评论 */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="添加评论..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim()}
                className="p-2 bg-blue-500 text-white rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">{comment.author.username}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <button className="hover:text-white">点赞</button>
                    <button className="hover:text-white">回复</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
