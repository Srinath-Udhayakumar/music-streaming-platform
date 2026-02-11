/**
 * Browse/Explore Page Component
 * Browse music by genre, artist, or album
 * Apple Music-inspired design
 */

import { songsAPI } from '@/api/songsAPI';
import SongCard from '@/components/SongCard';
import type { Song } from '@/types/api';
import { useEffect, useState } from 'react';
import '../styles/content-page.css';

interface Category {
  id: string;
  name: string;
  genre?: string;
}

interface BrowseProps {
  onPlayerChange?: (song: Song) => void;
}

const Browse = ({ onPlayerChange }: BrowseProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Load songs on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Extract unique genres as categories
  useEffect(() => {
    const genreSet = new Set<string>();
    songs.forEach(song => {
      if (song.genre) genreSet.add(song.genre);
    });
    
    const genreCategories: Category[] = Array.from(genreSet).map(genre => ({
      id: genre,
      name: genre,
      genre: genre,
    }));
    
    setCategories(genreCategories);
  }, [songs]);

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

  const getFilteredSongs = () => {
    let filtered = songs;

    // Filter by genre
    if (selectedCategory) {
      filtered = filtered.filter(song => song.genre === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        (song.album && song.album.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredSongs = getFilteredSongs();

  if (isLoading) {
    return (
      <div className="content">
        <div className="content-header">
          <h1>Browse</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {/* Header */}
      <div className="content-header">
        <h1>Browse</h1>
        <p>Discover music by genre and artist</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Categories/Genres */}
      {categories.length > 0 && (
        <div className="categories-section">
          <h2>Genres</h2>
          <div className="categories-grid">
            <button
              className={`category-button ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Songs Grid */}
      {filteredSongs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2>No Songs Found</h2>
          <p>Try searching or changing filters</p>
        </div>
      ) : (
        <div>
          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>
            {selectedCategory ? `${selectedCategory} Songs` : 'All Songs'}
          </h2>
          <div className="grid">
            {filteredSongs.map(song => (
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

export default Browse;
