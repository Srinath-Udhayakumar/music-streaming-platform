/**
 * Library Page Component
 * Your personal music collection
 * Apple Music-inspired design
 */

import { songsAPI } from '@/api/songsAPI';
import SongCard from '@/components/SongCard';
import type { Song } from '@/types/api';
import { useEffect, useState } from 'react';
import '../styles/content-page.css';

interface LibraryProps {
  onPlayerChange?: (song: Song) => void;
}

const Library = ({ onPlayerChange }: LibraryProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album' | 'duration'>('title');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Load songs on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const data = await songsAPI.getAllSongs();
      setSongs(data);
    } catch (err) {
      console.error('Failed to load songs:', err);
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort songs
  const getProcessedSongs = () => {
    let processed = songs;

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      processed = processed.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        (song.album && song.album.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'title':
        processed.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'artist':
        processed.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'album':
        processed.sort((a, b) => 
          (a.album || '').localeCompare(b.album || '')
        );
        break;
      case 'duration':
        processed.sort((a, b) => a.durationSeconds - b.durationSeconds);
        break;
    }

    return processed;
  };

  const processedSongs = getProcessedSongs();

  if (isLoading) {
    return (
      <div className="content">
        <div className="content-header">
          <h1>Library</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {/* Header */}
      <div className="content-header">
        <h1>Your Library</h1>
        <p>All your favorite music in one place</p>
      </div>

      {/* Controls */}
      <div className="library-controls">
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Sort Options */}
        <div className="sort-container">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Songs Grid */}
      {processedSongs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <h2>
            {songs.length === 0 
              ? 'No Songs in Library' 
              : 'No Songs Match Your Search'}
          </h2>
          <p>
            {songs.length === 0 
              ? 'Start adding songs to your library' 
              : 'Try a different search term'}
          </p>
        </div>
      ) : (
        <div>
          <p className="songs-count">
            {processedSongs.length} song{processedSongs.length !== 1 ? 's' : ''}
          </p>
          <div className="grid">
            {processedSongs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={(s) => {
                  setCurrentSong(s);
                  onPlayerChange?.(s);
                }}
                isPlaying={currentSong?.id === song.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
