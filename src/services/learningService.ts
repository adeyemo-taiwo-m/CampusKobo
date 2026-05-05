import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { LearningContent } from '../types';

export interface LearningCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
}

export const learningService = {
  /**
   * Fetch all learning categories from the backend
   */
  getCategories: async (): Promise<LearningCategory[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LEARNING_CATEGORIES);
      return Array.isArray(response) ? response : (response as any)?.data || [];
    } catch (error) {
      if (__DEV__) console.error('[learningService] Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Fetch learning content with optional filtering
   */
  getContent: async (params?: { 
    categoryId?: string; 
    type?: string; 
    isFeatured?: boolean;
    limit?: number;
  }): Promise<LearningContent[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LEARNING_CONTENT, { params });
      const data = Array.isArray(response) ? response : (response as any)?.data || [];
      
      // Transform backend data to frontend LearningContent interface if necessary
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        category: item.category_name || item.category?.name || 'Finance', // Use joined name if available
        duration: item.duration,
        content: item.content,
        isFeatured: item.is_featured,
        keyTakeaways: item.key_takeaways || [],
        relatedContentIds: item.related_content_ids || [],
        episodeNumber: item.episode_number,
      }));
    } catch (error) {
      if (__DEV__) console.error('[learningService] Error fetching content:', error);
      throw error;
    }
  },

  /**
   * Fetch a single content item by its ID
   */
  getContentById: async (id: string): Promise<LearningContent> => {
    try {
      const response: any = await apiClient.get(API_ENDPOINTS.LEARNING_CONTENT_BY_ID(id));
      const item = response?.data || response;
      
      return {
        id: item.id,
        title: item.title,
        type: item.type,
        category: item.category_name || item.category?.name || 'Finance',
        duration: item.duration,
        content: item.content,
        isFeatured: item.is_featured,
        keyTakeaways: item.key_takeaways || [],
        relatedContentIds: item.related_content_ids || [],
        episodeNumber: item.episode_number,
      };
    } catch (error) {
      if (__DEV__) console.error(`[learningService] Error fetching content by id [${id}]:`, error);
      throw error;
    }
  }
};
