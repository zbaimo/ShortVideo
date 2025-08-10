import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('videos');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const tabs = [
    { id: 'videos', label: '视频', count: 0 },
    { id: 'users', label: '用户', count: 0 },
    { id: 'sounds', label: '音乐', count: 0 },
    { id: 'tags', label: '标签', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 搜索头部 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索视频、用户、音乐..."
              className="w-full px-4 py-3 pl-12 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 搜索内容 */}
      <div className="p-4">
        {searchQuery ? (
          <div>
            {activeTab === 'videos' && (
              <div className="space-y-4">
                <p className="text-gray-600">搜索 "{searchQuery}" 的视频结果</p>
                {/* 这里应该显示视频搜索结果 */}
                <div className="text-center py-8 text-gray-500">
                  暂无搜索结果
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <p className="text-gray-600">搜索 "{searchQuery}" 的用户结果</p>
                {/* 这里应该显示用户搜索结果 */}
                <div className="text-center py-8 text-gray-500">
                  暂无搜索结果
                </div>
              </div>
            )}

            {activeTab === 'sounds' && (
              <div className="space-y-4">
                <p className="text-gray-600">搜索 "{searchQuery}" 的音乐结果</p>
                {/* 这里应该显示音乐搜索结果 */}
                <div className="text-center py-8 text-gray-500">
                  暂无搜索结果
                </div>
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="space-y-4">
                <p className="text-gray-600">搜索 "{searchQuery}" 的标签结果</p>
                {/* 这里应该显示标签搜索结果 */}
                <div className="text-center py-8 text-gray-500">
                  暂无搜索结果
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">开始搜索</h3>
            <p className="text-gray-600">搜索视频、用户、音乐等内容</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
