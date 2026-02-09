# Music Streaming Platform - Frontend

A production-ready React + TypeScript music streaming interface, inspired by Apple Music, with complete backend integration and industry-standard engineering practices.

## 🎯 Overview

This frontend implements a modern, responsive music player with:
- **JWT Authentication**: Secure token-based auth with automatic handling
- **Song Management**: Grid display, search, and streaming
- **Playlist Management**: Create, manage, and modify playlists
- **Global Player**: Persistent, feature-rich music player
- **Apple Music Design**: Minimalist, premium UI with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Production-Ready**: TypeScript strict mode, error handling, accessibility

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Backend running on `http://localhost:8081`
- PostgreSQL database (for backend)

### Setup

```bash
# Navigate to frontend directory
cd frontend/music-streaming-frontend

# Install dependencies
npm install

# Configure environment
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8081
VITE_API_TIMEOUT=30000
EOF

# Start development server
npm run dev

# Open http://localhost:5173 in browser
```

## 🛠️ Development

### Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── api/              # API layer with backend integration
├── auth/            # Authentication system with JWT
├── components/      # Reusable React components
├── pages/          # Page-level components
├── types/          # TypeScript definitions
├── utils/          # Utility functions
├── styles/         # CSS modules
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## 🔒 Authentication

JWT-based authentication with automatic token management:

```typescript
// Login
const { token, user } = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});

// Access global auth state
const { user, isAuthenticated, logout } = useAuth();
```

## 🎵 API Integration

```typescript
// Fetch songs
const songs = await songsAPI.getAllSongs();

// Search
const results = await songsAPI.searchByArtist('The Beatles');

// Manage playlists
const playlist = await playlistsAPI.create('My Favorites');
await playlistsAPI.addSong(playlistId, songId);
```

## 🎨 Design

- **Inspiration**: Apple Music
- **Colors**: Dark mode with purple accents
- **Responsive**: Desktop, tablet, mobile optimized
- **Animations**: Smooth transitions and micro-interactions

## 📊 Tech Stack

- **React 19** with TypeScript
- **Vite** build tool
- **Axios** for HTTP requests
- **React Router** for navigation
- **CSS3** for styling

## 📄 Documentation

- See [ARCHITECTURE.md](../../frontend/ARCHITECTURE.md) for complete technical documentation
- See [INTEGRATION_GUIDE.md](../../INTEGRATION_GUIDE.md) for backend integration details

## 🚀 Production Deployment

```bash
# Build optimized bundle
npm run build

# Environment for production
VITE_API_BASE_URL=https://your-api-domain.com

# Deploy dist/ folder to hosting service
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
