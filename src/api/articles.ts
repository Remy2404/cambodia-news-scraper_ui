import { apiClient } from './client';
import type { Article, ArticleFormData } from '../types';

// Simplified getArticles function for basic usage
export const getArticles = async () => {
  const response = await apiClient.get<Article[]>('/articles');
  return response.data;
};

export const articleService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      _page: page.toString(),
      _limit: limit.toString(),
      _sort: 'published_at',
      _order: 'desc',
    });
    
    if (search) {
      params.append('q', search);
    }

    const response = await apiClient.get<Article[]>(`/articles?${params.toString()}`);
    // JSON Server returns total count in headers
    const totalCount = parseInt(response.headers['x-total-count'] || '0', 10);
    
    return {
      data: response.data,
      total: totalCount,
    };
  },

  getById: async (id: string | number) => {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  },

  create: async (data: ArticleFormData) => {
    const payload = {
      ...data,
      published_at: new Date().toISOString(),
    };
    const response = await apiClient.post<Article>('/articles', payload);
    return response.data;
  },

  update: async (id: string | number, data: ArticleFormData) => {
    const response = await apiClient.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    await apiClient.delete(`/articles/${id}`);
  },
};

