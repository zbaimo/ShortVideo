import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark } from 'lucide-react';

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

interface VideoCardProps {
  video: Video;
  onVideoClick: () => void;
  onLike: () => void;
  isActive: boolean;
  onVisibilityChange: (isVisible: boolean) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onVideoClick,
  onLike,
  isActive,
  onVisibilityChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        onVisibilityChange(visible);
        
        if (visible && isActive) {
          setIsPlaying(true);
          videoRef.current?.play().catch(console.error);
        } else {
          setIsPlaying(false);
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [isActive, onVisibilityChange]);

  const handleVideoClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
      videoRef.current?.pause();
    } else {
      setIsPlaying(true);
      videoRef.current?.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="relative h-full bg-black">
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
        <div className="relative">
          <img
            src={video.creator.avatar || '/default-avatar.png'}
            alt={video.creator.username}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          {video.creator.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <button onClick={onLike} className="flex flex-col items-center space-y-1">
          <div className={`p-3 rounded-full ${video.isLiked ? 'bg-red-500' : 'bg-black bg-opacity-50'}`}>
            <Heart className={`w-6 h-6 ${video.isLiked ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-white text-sm font-medium">{formatNumber(video.likeCount)}</span>
        </button>

        <button onClick={onVideoClick} className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-black bg-opacity-50">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm font-medium">{formatNumber(video.commentCount)}</span>
        </button>

        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-black bg-opacity-50">
            <Share className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm font-medium">分享</span>
        </button>

        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-black bg-opacity-50">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-sm font-medium">收藏</span>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-20 text-white">
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">@{video.creator.username}</span>
            {video.creator.isVerified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="text-sm">{video.description}</div>
        </div>
        <div className="text-sm text-gray-300">{formatNumber(video.views)}次观看</div>
      </div>

      <button onClick={toggleMute} className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50">
        {isMuted ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoCard;
