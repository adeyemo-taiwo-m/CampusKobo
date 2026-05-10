import { LearningContent } from '../types';

/**
 * Returns the appropriate image source for a learning content item.
 * Prioritizes item's image_url, then falls back to local placeholders.
 */
export const getLearningImageSource = (item: Partial<LearningContent>) => {
  const imageUri = item.cover_image_url || item.image_url || item.media_url;
  
  if (imageUri && typeof imageUri === 'string' && imageUri.startsWith('http')) {
    return { uri: imageUri };
  }
  
  // Fallback to local placeholders based on type
  switch (item.type) {
    case 'article':
      return require('../../assets/images/fallback_article.jpg');
    case 'video':
      return require('../../assets/images/fallback_video.jpg');
    case 'podcast':
      return require('../../assets/images/fallback_podcast.jpg');
    default:
      return require('../../assets/images/fallback_article.jpg');
  }
};
