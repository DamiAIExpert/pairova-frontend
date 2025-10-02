# Job Finder - Pairova Frontend

A modern **React + Vite** application for job seekers and NGOs to discover opportunities, manage profiles, and connect through the Pairova platform. Built with **TypeScript**, **Tailwind CSS**, and integrated with a powerful **NestJS backend API** for real-time job matching and AI-powered recommendations.

---

## Quick Start

### Prerequisites
- **Node.js 18+** (20+ recommended)
- **Backend API** running on `http://localhost:3001`
- **AI Microservice** running on `http://localhost:8000` (for intelligent job matching)
- **PostgreSQL Database** for data storage and prediction caching

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```bash
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Job Finder
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server
```bash
npm run dev
# Available at http://localhost:5173
```

---

## Features

### 🔍 Advanced Job Search
- **Smart Search**: AI-powered job discovery with intelligent matching
- **Dynamic Filters**: Location, salary, experience level, employment type
- **Real-time Results**: Live job listings with instant updates
- **Match Scoring**: Compatibility scores between jobs and profiles
- **Trending Jobs**: Popular opportunities based on application volume

### 🤖 AI-Powered Recommendations
- **Personalized Suggestions**: Job recommendations powered by ML microservice
- **Match Insights**: Detailed compatibility breakdowns with AI scoring
- **Career Guidance**: Skill gap analysis and development recommendations
- **Market Trends**: Industry insights and salary analysis
- **Real-time Scoring**: Live job-applicant compatibility scores

### 👤 Profile Management
- **Complete Profiles**: Comprehensive applicant and NGO profiles
- **Skills Management**: Dynamic skills tracking and suggestions
- **Experience Tracking**: Work history and education management
- **Certifications**: Professional certification management

### 📋 Application Management
- **One-Click Applications**: Streamlined application process
- **Application Tracking**: Status monitoring and updates
- **Cover Letter Management**: Personalized application materials
- **Resume Upload**: Document management and storage

---

## API Integration

This frontend is **fully integrated** with the Pairova backend API:

### ✅ Real-time Job Search
- **Dynamic Search**: Live job results with instant filtering
- **AI Matching**: Smart job recommendations powered by ML microservice
- **Trending Analysis**: Popular jobs based on application metrics
- **Similar Jobs**: Recommendations based on job characteristics
- **Prediction Caching**: Optimized performance with intelligent caching

### ✅ Authentication & Authorization
- **User Registration**: Sign up as job seeker or NGO
- **Secure Login**: JWT-based authentication
- **Role-based Access**: Different experiences for applicants vs NGOs
- **Session Management**: Persistent login state

---

## Tech Stack

- **React 19** – Modern React with latest features
- **Vite** – Fast build tool and development server
- **TypeScript** – Type safety and better development experience
- **Tailwind CSS** – Utility-first styling
- **React Router** – Client-side routing
- **Zustand** – Lightweight state management
- **Lucide React** – Modern icon library
- **Radix UI** – Accessible component primitives

---

## Project Structure

```
src/
  components/
    jobSeeker/
      seeker/
        finder.tsx                # Job search interface
        job.tsx                   # Job details page
      profile/
        profile.tsx               # User profile display
        settings.tsx              # Profile settings
      onboarding/                 # Multi-step registration
  pages/
    seeker/
      finderPage.tsx             # Job search page
      jobPage.tsx                # Job details page
      profilePage.tsx            # User profile page
  lib/
    api.ts                       # Base API client
    services/
      job.service.ts             # Job search and management
      auth.service.ts            # Authentication services
      profile.service.ts         # Profile management
  hooks/
    useApi.ts                    # Custom React hooks
  store.ts                       # Zustand state management
```

---

## Authentication

The application supports two user types:

### Job Seekers (Applicants)
- **Registration**: Complete profile setup with skills and experience
- **Profile Management**: Update skills, experience, and preferences
- **Job Search**: Advanced search with AI recommendations
- **Applications**: Apply to jobs and track application status

### NGOs (Non-Profit Organizations)
- **Registration**: Organization profile setup
- **Job Posting**: Create and manage job listings
- **Candidate Discovery**: Find and evaluate applicants
- **Application Management**: Review and manage applications

---

## API Services

### JobService
- **Search**: `searchJobs()`, `getTrendingJobs()`, `getSimilarJobs()`
- **Recommendations**: `getRecommendedJobs()`, `calculateMatchScore()`
- **Applications**: `applyToJob()`, `getMyApplications()`

### AuthService
- **Registration**: `register(userData)`
- **Login**: `login(email, password)`
- **Profile**: `getCurrentUser()`

### ProfileService
- **Applicant Profiles**: `getApplicantProfile()`, `updateApplicantProfile()`
- **NGO Profiles**: `getNonprofitProfile()`, `updateNonprofitProfile()`
- **Education/Experience**: Full CRUD operations

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import on Vercel
3. Configure environment variables
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run preview
```

---

## Scripts

| Script           | Description                                   |
|------------------|-----------------------------------------------|
| `dev`            | Run the Vite development server               |
| `build`          | Create an optimized production build          |
| `preview`        | Preview the production build                  |
| `lint`           | Run ESLint                                    |

---

## Troubleshooting

### Common Issues

#### API Connection Errors
- **Solution**: Ensure backend is running on `http://localhost:3001`
- **Check**: Verify `VITE_API_URL` in `.env` file

#### Authentication Issues
- **Solution**: Check JWT token validity and backend authentication
- **Debug**: Check browser console for API errors

#### Build Errors
- **Solution**: Run `npm run typecheck` for diagnostics
- **Fix**: Ensure all API types are properly imported

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

## License

Copyright © Pairova. All rights reserved.

---

**Built with ❤️ by the Pairova Team**

