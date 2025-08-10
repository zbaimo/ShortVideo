import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('获取token失败:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
        // 这里可以添加导航到登录页的逻辑
      } catch (storageError) {
        console.error('清除存储失败:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  // 用户注册
  register: (data: any) => api.post('/users/register', data),
  
  // 用户登录
  login: (data: any) => api.post('/users/login', data),
  
  // 获取用户资料
  getProfile: () => api.get('/users/profile'),
  
  // 更新用户资料
  updateProfile: (data: any) => api.put('/users/profile', data),
  
  // 获取用户信息
  getUserById: (id: string) => api.get(`/users/${id}`),
  
  // 关注用户
  followUser: (id: string) => api.post(`/users/${id}/follow`),
  
  // 取消关注用户
  unfollowUser: (id: string) => api.delete(`/users/${id}/follow`),
};

// 视频相关API
export const videoApi = {
  // 获取推荐视频
  getRecommended: (page = 1, limit = 10) => 
    api.get(`/videos/recommended?page=${page}&limit=${limit}`),
  
  // 获取短视频
  getShortVideos: (page = 1, limit = 20) => 
    api.get(`/videos/short?page=${page}&limit=${limit}`),
  
  // 获取长视频
  getLongVideos: (page = 1, limit = 10) => 
    api.get(`/videos/long?page=${page}&limit=${limit}`),
  
  // 获取单个视频
  getVideoById: (id: string) => api.get(`/videos/${id}`),
  
  // 上传视频
  uploadVideo: (data: any, onProgress?: (progress: any) => void) => {
    return api.post('/videos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });
  },
  
  // 更新视频
  updateVideo: (id: string, data: any) => api.put(`/videos/${id}`, data),
  
  // 删除视频
  deleteVideo: (id: string) => api.delete(`/videos/${id}`),
  
  // 点赞/取消点赞视频
  toggleLike: (id: string) => api.post(`/videos/${id}/like`),
  
  // 搜索视频
  searchVideos: (query: string, page = 1, limit = 10, category?: string, videoType?: string) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) params.append('category', category);
    if (videoType) params.append('videoType', videoType);
    
    return api.get(`/videos/search?${params.toString()}`);
  },
};

// 评论相关API
export const commentApi = {
  // 获取视频评论
  getComments: (videoId: string, page = 1, limit = 20) =>
    api.get(`/videos/${videoId}/comments?page=${page}&limit=${limit}`),
  
  // 添加评论
  addComment: (videoId: string, data: any) =>
    api.post(`/videos/${videoId}/comments`, data),
  
  // 删除评论
  deleteComment: (commentId: string) =>
    api.delete(`/comments/${commentId}`),
  
  // 点赞评论
  likeComment: (commentId: string) =>
    api.post(`/comments/${commentId}/like`),
};

export default api;
