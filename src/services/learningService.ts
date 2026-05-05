import { supabase } from '../lib/supabase';

/**
 * LearningService handles all Supabase queries for the Learning feature.
 */
export const LearningService = {
  /**
   * Fetches all rows from learning_categories, ordered by name.
   */
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('learning_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getAllCategories:', error);
      return [];
    }
  },

  /**
   * Fetches from learning_content joined with learning_categories.
   * If categorySlug is provided, filter by that category.
   * Excludes Finance 101 series (filter out category name 'Finance 101').
   * Order by created_at descending.
   */
  async getAllContent(categorySlug?: string) {
    try {
      let query = supabase
        .from('learning_content')
        .select(`
          *,
          learning_categories!inner(name, slug)
        `)
        .neq('learning_categories.name', 'Finance 101')
        .order('created_at', { ascending: false });

      if (categorySlug) {
        query = query.eq('learning_categories.slug', categorySlug);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getAllContent:', error);
      return [];
    }
  },

  /**
   * Fetches where is_featured = true, limit 1.
   */
  async getFeaturedContent() {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          learning_categories(name, slug)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getFeaturedContent:', error);
      return [];
    }
  },

  /**
   * Fetches all content from category 'Finance 101', ordered by episode_number ascending.
   */
  async getFinance101Series() {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          learning_categories!inner(name, slug)
        `)
        .eq('learning_categories.slug', 'finance-101')
        .order('episode_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getFinance101Series:', error);
      return [];
    }
  },

  /**
   * Fetches a single content item by its id.
   */
  async getContentById(id: string) {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          learning_categories(name, slug)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('[LearningService] Error in getContentById:', error);
      return null;
    }
  },

  /**
   * Fetches all glossary terms.
   * If searchQuery is provided, filter where term ILIKE %searchQuery%.
   * Order by term ascending.
   */
  async getGlossaryTerms(searchQuery?: string) {
    try {
      let query = supabase
        .from('glossary_terms')
        .select('*')
        .order('term', { ascending: true });

      if (searchQuery) {
        query = query.ilike('term', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getGlossaryTerms:', error);
      return [];
    }
  },

  /**
   * Fetches where is_term_of_day = true, limit 1.
   * If none, fetch first term alphabetically.
   */
  async getTermOfDay() {
    try {
      // First try to get the designated term of the day
      const { data: featuredData, error: featuredError } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('is_term_of_day', true)
        .limit(1)
        .single();

      if (featuredData) return featuredData;

      // Fallback: get the first term alphabetically
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .order('term', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('[LearningService] Error in getTermOfDay:', error);
      return null;
    }
  },

  /**
   * Fetches all progress rows for this userId from user_content_progress.
   */
  async getUserProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_content_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getUserProgress:', error);
      return [];
    }
  },

  /**
   * Upserts into user_content_progress.
   */
  async updateUserProgress(userId: string, contentId: string, status: string, percent: number) {
    try {
      const { data, error } = await supabase
        .from('user_content_progress')
        .upsert({
          user_id: userId,
          content_id: contentId,
          status: status,
          progress_percent: percent,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,content_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('[LearningService] Error in updateUserProgress:', error);
      return null;
    }
  },

  /**
   * Fetches all bookmark rows for this userId.
   */
  async getUserBookmarks(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select(`
          *,
          learning_content(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[LearningService] Error in getUserBookmarks:', error);
      return [];
    }
  },

  /**
   * If isBookmarked is true, delete the bookmark. If false, insert a new bookmark.
   */
  async toggleBookmark(userId: string, contentId: string, isBookmarked: boolean) {
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .match({ user_id: userId, content_id: contentId });

        if (error) throw error;
        return false; // New state
      } else {
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({
            user_id: userId,
            content_id: contentId
          });

        if (error) throw error;
        return true; // New state
      }
    } catch (error) {
      console.error('[LearningService] Error in toggleBookmark:', error);
      return isBookmarked; // Return old state on error
    }
  }
};
