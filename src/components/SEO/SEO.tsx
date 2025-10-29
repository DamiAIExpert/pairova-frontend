// src/components/SEO/SEO.tsx
// SEO Component for managing page metadata dynamically

import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  author = 'Pairova',
  ogType = 'website',
  ogImage = 'https://pairova.com/Images/logo.AVIF',
  ogImageWidth = '1200',
  ogImageHeight = '630',
  twitterCard = 'summary_large_image',
  canonical,
  noindex = false,
  nofollow = false,
  structuredData,
}) => {
  const siteTitle = 'Pairova - Connect Talent with Purpose';
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription =
    description ||
    'Find meaningful employment opportunities with nonprofit organizations. Connect talented professionals with purpose-driven work.';
  const siteKeywords = keywords.length > 0 ? keywords.join(', ') : 
    'nonprofit jobs, social impact careers, purpose-driven work, nonprofit employment, charity jobs, NGO careers';
  
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  const canonicalUrl = canonical || typeof window !== 'undefined' ? window.location.href : 'https://pairova.com';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={ogImageWidth} />
      <meta property="og:image:height" content={ogImageHeight} />
      <meta property="og:site_name" content="Pairova" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;


