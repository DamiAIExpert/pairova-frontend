import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    sitemap({
      hostname: 'https://pairova.com',
      dynamicRoutes: [
        '/',
        '/login',
        '/register',
        '/jobs',
        '/jobs/finder',
        '/about',
        '/contact',
        '/nonprofit/dashboard',
        '/seeker/profile',
      ],
      exclude: ['/api', '/auth'],
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      readable: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
