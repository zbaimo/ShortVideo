import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { useAuthStore } from '../store/authStore';
import { api } from '../utils/api';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    _id: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  views: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isLiked?: boolean;
}

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver>();
  const lastVideoRef = useRef<HTMLDivElement>(null);

  const fetchVideos = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/videos/recommended?page=${pageNum}&limit=10`);
      const newVideos = response.data.videos;
      
      if (pageNum === 1) {
        setVideos(newVideos);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }
      
      setHasMore(newVideos.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchVideos(page + 1);
      }
    });

    if (lastVideoRef.current) {
      observer.current.observe(lastVideoRef.current);
    }
  }, [loading, hasMore, page, fetchVideos]);

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const handleLike = async (videoId: string, isLiked: boolean) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/videos/${videoId}/like`);
      
      setVideos(prev => prev.map(video => 
        video._id === videoId 
          ? { 
              ...video, 
              isLiked: !isLiked,
              likeCount: isLiked ? video.likeCount - 1 : video.likeCount + 1
            }
          : video
      ));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto">
        {videos.map((video, index) => (
          <div
            key={video._id}
            ref={index === videos.length - 1 ? lastVideoRef : null}
            className="relative h-screen"
          >
            <VideoCard
              video={video}
              onVideoClick={() => handleVideoClick(video._id)}
              onLike={() => handleLike(video._id, video.isLiked || false)}
              isActive={index === activeVideoIndex}
              onVisibilityChange={(isVisible) => {
                if (isVisible) {
                  setActiveVideoIndex(index);
                }
              }}
            />
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {!hasMore && videos.length > 0 && (
          <div className="text-center text-gray-400 py-8">
            没有更多视频了
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
