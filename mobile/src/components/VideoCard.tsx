import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Video as VideoType } from '../types';

const { width, height } = Dimensions.get('window');

interface VideoCardProps {
  video: VideoType;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // 当组件挂载时自动播放
    setIsPlaying(true);
  }, []);

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current?.playAsync();
      setIsPlaying(true);
    }
  };

  const toggleMute = async () => {
    if (isMuted) {
      await videoRef.current?.setIsMutedAsync(false);
      setIsMuted(false);
    } else {
      await videoRef.current?.setIsMutedAsync(true);
      setIsMuted(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // 这里可以调用API来更新点赞状态
  };

  const handleComment = () => {
    // 这里可以导航到评论页面
    console.log('打开评论');
  };

  const handleShare = () => {
    // 这里可以实现分享功能
    console.log('分享视频');
  };

  const handleBookmark = () => {
    // 这里可以实现收藏功能
    console.log('收藏视频');
  };

  return (
    <View style={styles.container}>
      {/* 视频播放器 */}
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={togglePlayPause}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: video.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping
          isMuted={isMuted}
          usePoster
          posterSource={{ uri: video.thumbnailUrl }}
          posterStyle={styles.poster}
        />

        {/* 播放/暂停按钮 */}
        {!isPlaying && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={40} color="white" />
          </View>
        )}

        {/* 静音按钮 */}
        <TouchableOpacity
          style={styles.muteButton}
          onPress={toggleMute}
        >
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-high'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* 右侧操作按钮 */}
      <View style={styles.actionButtons}>
        {/* 用户头像 */}
        <TouchableOpacity style={styles.userAvatar}>
          <Image
            source={{ uri: video.creator.avatar }}
            style={styles.avatar}
            defaultSource={require('../../../assets/default-avatar.png')}
          />
        </TouchableOpacity>

        {/* 点赞按钮 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={isLiked ? '#ff4757' : 'white'}
          />
          <Text style={styles.actionText}>{video.likeCount}</Text>
        </TouchableOpacity>

        {/* 评论按钮 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleComment}
        >
          <Ionicons name="chatbubble-outline" size={28} color="white" />
          <Text style={styles.actionText}>{video.commentCount}</Text>
        </TouchableOpacity>

        {/* 分享按钮 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={28} color="white" />
          <Text style={styles.actionText}>{video.shares}</Text>
        </TouchableOpacity>

        {/* 收藏按钮 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBookmark}
        >
          <Ionicons name="bookmark-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* 底部视频信息 */}
      <View style={styles.videoInfo}>
        <Text style={styles.username}>@{video.creator.username}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={styles.category}>{video.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.views}>{video.views} 次观看</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 100,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    color: '#ccc',
    fontSize: 12,
  },
  dot: {
    color: '#ccc',
    fontSize: 12,
    marginHorizontal: 8,
  },
  views: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default VideoCard;
