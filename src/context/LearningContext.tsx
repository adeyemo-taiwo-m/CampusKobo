import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LearningService } from '../services/LearningService';
import { useAppContext } from './AppContext';

interface LearningContextType {
  categories: any[];
  allContent: any[];
  featuredContent: any[];
  finance101Series: any[];
  glossaryTerms: any[];
  userProgress: Record<string, any>;
  bookmarks: string[];
  isLoadingLearning: boolean;
  selectedCategory: string | null;
  loadLearningData: () => Promise<void>;
  setSelectedCategory: (slug: string | null) => void;
  getFilteredContent: () => any[];
  markContentProgress: (contentId: string, status: string, percent: number) => Promise<void>;
  toggleBookmark: (contentId: string) => Promise<void>;
  isBookmarked: (contentId: string) => boolean;
  getProgressForContent: (contentId: string) => any | null;
  searchGlossary: (query: string) => any[];
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const useLearningContext = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningContext must be used within a LearningContextProvider');
  }
  return context;
};

export const LearningContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAppContext();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [allContent, setAllContent] = useState<any[]>([]);
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [finance101Series, setFinance101Series] = useState<any[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoadingLearning, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadLearningData = async () => {
    setIsLoading(true);
    try {
      const [cats, content, series, terms, featured] = await Promise.all([
        LearningService.getAllCategories(),
        LearningService.getAllContent(),
        LearningService.getFinance101Series(),
        LearningService.getGlossaryTerms(),
        LearningService.getFeaturedContent()
      ]);

      setCategories(cats);
      setAllContent(content);
      setFinance101Series(series);
      setGlossaryTerms(terms);
      setFeaturedContent(featured);

      // Load user specific data if authenticated
      if (isAuthenticated && user?.id) {
        const [progress, userBookmarks] = await Promise.all([
          LearningService.getUserProgress(user.id),
          LearningService.getUserBookmarks(user.id)
        ]);

        // Convert progress array to map for fast lookup
        const progressMap: Record<string, any> = {};
        progress.forEach((p: any) => {
          progressMap[p.content_id] = p;
        });
        setUserProgress(progressMap);

        // Convert bookmarks to array of IDs
        setBookmarks(userBookmarks.map((b: any) => b.content_id));
      }
    } catch (error) {
      console.error('[LearningContext] Error loading learning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLearningData();
  }, [isAuthenticated, user?.id]);

  const getFilteredContent = () => {
    if (!selectedCategory) return allContent;
    
    // Debug log to see why filtering might be failing
    console.log('[LearningContext] Filtering for:', selectedCategory);
    if (allContent.length > 0) {
      console.log('[LearningContext] Sample content category slug:', allContent[0].learning_categories?.slug);
    }

    return allContent.filter(item => {
      const itemSlug = item.learning_categories?.slug;
      if (!itemSlug) return false;
      return itemSlug.toLowerCase() === selectedCategory.toLowerCase();
    });
  };

  const markContentProgress = async (contentId: string, status: string, percent: number) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const result = await LearningService.updateUserProgress(user.id, contentId, status, percent);
      if (result) {
        setUserProgress(prev => ({
          ...prev,
          [contentId]: result
        }));
      }
    } catch (error) {
      console.error('[LearningContext] Error marking progress:', error);
    }
  };

  const toggleBookmark = async (contentId: string) => {
    if (!isAuthenticated || !user?.id) return;

    const isCurrentlyBookmarked = bookmarks.includes(contentId);
    try {
      const newState = await LearningService.toggleBookmark(user.id, contentId, isCurrentlyBookmarked);
      
      if (newState) {
        setBookmarks(prev => [...prev, contentId]);
      } else {
        setBookmarks(prev => prev.filter(id => id !== contentId));
      }
    } catch (error) {
      console.error('[LearningContext] Error toggling bookmark:', error);
    }
  };

  const isBookmarked = (contentId: string) => {
    return bookmarks.includes(contentId);
  };

  const getProgressForContent = (contentId: string) => {
    return userProgress[contentId] || null;
  };

  const searchGlossary = (query: string) => {
    if (!query) return glossaryTerms;
    const lowerQuery = query.toLowerCase();
    return glossaryTerms.filter(term => 
      term.term.toLowerCase().includes(lowerQuery) || 
      term.definition.toLowerCase().includes(lowerQuery)
    );
  };

  const value = {
    categories,
    allContent,
    featuredContent,
    finance101Series,
    glossaryTerms,
    userProgress,
    bookmarks,
    isLoadingLearning,
    selectedCategory,
    loadLearningData,
    setSelectedCategory,
    getFilteredContent,
    markContentProgress,
    toggleBookmark,
    isBookmarked,
    getProgressForContent,
    searchGlossary
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
