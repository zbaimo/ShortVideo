export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  role: 'user' | 'creator' | 'admin';
  followers: User[];
  following: User[];
  videos: Video[];
  likes: Video[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: string[];
  dislikes: string[];
  comments: Comment[];
  shares: number;
  category: 'entertainment' | 'education' | 'sports' | 'music' | 'comedy' | 'lifestyle' | 'news' | 'other';
  tags: string[];
  isPublic: boolean;
  isMonetized: boolean;
  creator: User;
  location: string;
  language: string;
  videoType: 'short' | 'long';
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  video: string;
  parentComment?: string;
  replies: Comment[];
  likes: string[];
  dislikes: string[];
  isEdited: boolean;
  isDeleted: boolean;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalVideos: number;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  password?: string;
}

export interface UploadVideoData {
  title: string;
  description: string;
  category: Video['category'];
  tags: string;
  videoType: 'short' | 'long';
  videoUrl?: string;
  thumbnailUrl?: string;
}

// 移动端特有类型
export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface VideoPlayerProps {
  video: Video;
  isVisible: boolean;
  onClose: () => void;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
