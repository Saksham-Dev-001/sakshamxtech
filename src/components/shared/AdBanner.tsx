import React from 'react';

interface AdBannerProps {
  placement?: 'header' | 'sidebar' | 'inArticle';
}

// User requested to remove all promotional credit banners and ads
export const AdBanner: React.FC<AdBannerProps> = () => {
  return null;
};
