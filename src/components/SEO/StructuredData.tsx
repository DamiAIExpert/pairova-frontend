// src/components/SEO/StructuredData.tsx
// Structured Data components for different schema types

import { Helmet } from 'react-helmet-async';
import type { Job } from '../../services/jobs.service';

interface JobPostingStructuredDataProps {
  job: Job;
}

export const JobPostingStructuredData: React.FC<JobPostingStructuredDataProps> = ({ job }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: job.status === 'PUBLISHED' ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    employmentType: job.employmentType?.replace('_', ' '),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.nonprofit.orgName,
      logo: job.nonprofit.logoUrl,
      sameAs: `https://pairova.com/nonprofit/${job.nonprofitId}`,
    },
    jobLocation: job.placement === 'REMOTE' ? {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Remote',
        addressCountry: 'US',
      },
    } : {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.locationCity,
        addressRegion: job.locationState,
        addressCountry: job.locationCountry || 'US',
      },
    },
    baseSalary: job.salaryMin && job.salaryMax ? {
      '@type': 'MonetaryAmount',
      currency: job.currency || 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: 'YEAR',
      },
    } : undefined,
    workHours: job.employmentType === 'FULL_TIME' ? '40 hours per week' : undefined,
    jobLocationType: job.placement,
    applicantLocationRequirements: job.placement !== 'REMOTE' && job.locationCountry ? {
      '@type': 'Country',
      name: job.locationCountry,
    } : undefined,
    experienceRequirements: job.experienceMinYrs ? {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: job.experienceMinYrs * 12,
    } : undefined,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQStructuredData: React.FC<FAQStructuredDataProps> = ({ faqs }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default JobPostingStructuredData;

