import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterCredentials, UpdateProfileData } from '../types';
import { userApi } from '../utils/api';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response = await userApi.login(credentials);
          const { token, ...user } = response.data;
          
          // 保存到本地存储
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
          });
          throw new Error(error.response?.data?.message || '登录失败');
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true });
          const response = await userApi.register(credentials);
          const { token, ...user } = response.data;
          
          // 保存到本地存储
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
          });
          throw new Error(error.response?.data?.message || '注册失败');
        }
      },

      logout: () => {
        // 清除本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateProfile: async (data: UpdateProfileData) => {
        try {
          set({ isLoading: true });
          const response = await userApi.updateProfile(data);
          const { token, ...user } = response.data;
          
          // 更新本地存储
          if (token) {
            localStorage.setItem('token', token);
          }
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token: token || get().token,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
          });
          throw new Error(error.response?.data?.message || '更新资料失败');
        }
      },

      loadProfile: async () => {
        try {
          set({ isLoading: true });
          const response = await userApi.getProfile();
          const user = response.data;
          
          set({
            user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
          });
          // 如果获取资料失败，可能是token过期，清除认证状态
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      clearError: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
