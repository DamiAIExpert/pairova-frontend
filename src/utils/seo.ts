// src/utils/seo.ts
// SEO utility functions

/**
 * Generate page title with site name
 */
export const generatePageTitle = (title?: string): string => {
  const siteTitle = 'Pairova - Connect Talent with Purpose';
  return title ? `${title} | ${siteTitle}` : siteTitle;
};

/**
 * Generate meta description
 */
export const generateDescription = (description: string, maxLength = 160): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://pairova.com';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * Generate social media image URL
 */
export const generateOGImage = (imagePath?: string): string => {
  if (!imagePath) return 'https://pairova.com/Images/logo.AVIF';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://pairova.com${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

/**
 * Generate job-specific keywords
 */
export const generateJobKeywords = (job: {
  title: string;
  placement?: string;
  employmentType?: string;
  locationCity?: string;
  locationState?: string;
}): string[] => {
  const keywords = [
    job.title,
    'nonprofit job',
    'social impact career',
  ];

  if (job.placement) {
    keywords.push(`${job.placement.toLowerCase()} job`);
  }

  if (job.employmentType) {
    keywords.push(job.employmentType.toLowerCase().replace('_', ' '));
  }

  if (job.locationCity && job.locationState) {
    keywords.push(`jobs in ${job.locationCity}`);
    keywords.push(`${job.locationState} jobs`);
  }

  keywords.push('nonprofit employment', 'purpose-driven work', 'charity job');

  return keywords;
};

/**
 * Sanitize text for meta descriptions
 */
export const sanitizeForMeta = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Generate breadcrumb items
 */
export const generateBreadcrumbs = (paths: string[]): Array<{ name: string; url: string }> => {
  const breadcrumbs = [{ name: 'Home', url: 'https://pairova.com/' }];

  let currentPath = '';
  paths.forEach((path) => {
    if (!path) return;
    currentPath += `/${path}`;
    breadcrumbs.push({
      name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      url: `https://pairova.com${currentPath}`,
    });
  });

  return breadcrumbs;
};

/**
 * SEO-friendly URL slug generator
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export default {
  generatePageTitle,
  generateDescription,
  generateCanonicalUrl,
  generateOGImage,
  generateJobKeywords,
  sanitizeForMeta,
  generateBreadcrumbs,
  generateSlug,
};

