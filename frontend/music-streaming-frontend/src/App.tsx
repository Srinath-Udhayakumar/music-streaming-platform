/**
 * Main App Component
 * Routing, layout, and global state management
 */

import { songsAPI } from '@/api/songsAPI';
import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import PlayerBar from '@/components/PlayerBar';
import Sidebar from '@/components/Sidebar';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import type { Song } from '@/types/api';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';

/**
 * Inner App Component
 * Uses auth context (must be inside AuthProvider)
 */
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  // Fetch songs when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSongs = async () => {
      setIsLoadingSongs(true);
      try {
        const data = await songsAPI.getAllSongs();
        setSongs(data);
      } catch (error) {
        console.error('Failed to load songs:', error);
        setSongs([]);
      } finally {
        setIsLoadingSongs(false);
      }
    };

    fetchSongs();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home
                  songs={songs}
                  onSelect={setCurrentSong}
                  isLoading={isLoadingSongs}
                  onPlayerChange={setCurrentSong}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <Home
                  songs={songs}
                  onSelect={setCurrentSong}
                  isLoading={isLoadingSongs}
                  onPlayerChange={setCurrentSong}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Home
                  songs={songs}
                  onSelect={setCurrentSong}
                  isLoading={isLoadingSongs}
                  onPlayerChange={setCurrentSong}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Fixed Player Bar */}
      <PlayerBar 
        song={currentSong}
        onNext={() => {
          if (!currentSong) return;
          const currentIndex = songs.findIndex(s => s.id === currentSong.id);
          if (currentIndex < songs.length - 1) {
            const nextSong = songs[currentIndex + 1];
            setCurrentSong(nextSong);
          }
        }}
        onPrevious={() => {
          if (!currentSong) return;
          const currentIndex = songs.findIndex(s => s.id === currentSong.id);
          if (currentIndex > 0) {
            const prevSong = songs[currentIndex - 1];
            setCurrentSong(prevSong);
          }
        }}
      />
    </div>
  );
};

/**
 * Root App Component with Router and Auth Provider
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// Simple Navigate component for redirects
const Navigate = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
};

export default App;
