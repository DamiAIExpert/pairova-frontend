// src/pages/home/SEOLandingPage.tsx
// Example landing page with SEO optimization

import { SEO } from '../../components/SEO';
import { BreadcrumbStructuredData } from '../../components/SEO';
import LandingPage from './landingPage';

export const SEOLandingPage = () => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pairova.com/' },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Find meaningful employment opportunities with nonprofit organizations. Connect talented professionals with purpose-driven work. Discover remote, hybrid, and onsite jobs that make a difference."
        keywords={[
          'nonprofit jobs',
          'social impact careers',
          'purpose-driven work',
          'nonprofit employment',
          'charity jobs',
          'NGO careers',
          'volunteer opportunities',
          'remote nonprofit jobs',
        ]}
        canonical="https://pairova.com/"
      />
      <BreadcrumbStructuredData items={breadcrumbs} />
      <LandingPage />
    </>
  );
};

export default SEOLandingPage;

