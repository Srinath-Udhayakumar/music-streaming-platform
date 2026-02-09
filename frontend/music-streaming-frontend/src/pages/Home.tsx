/**
 * Home Page Component
 * Main library view with song grid and search
 */

import { useState, useEffect } from 'react';
import SongCard from '@/components/SongCard';
import type { Song, Playlist } from '@/types/api';
import { songsAPI } from '@/api/songsAPI';
import { playlistsAPI } from '@/api/playlistsAPI';

interface HomeProps {
  songs: Song[];
  onSelect: (song: Song) => void;
  isLoading?: boolean;
  onPlayerChange?: (song: Song) => void;
}

const Home = ({ 
  songs, 
  onSelect, 
  isLoading = false,
  onPlayerChange
}: HomeProps) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);

  // Fetch user playlists on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlists = await playlistsAPI.getUserPlaylists();
        setUserPlaylists(playlists);
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  // Filter songs based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSongs(songs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = songs.filter(
      song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        (song.album && song.album.toLowerCase().includes(query))
    );
    setFilteredSongs(filtered);
  }, [searchQuery, songs]);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    onSelect(song);
    onPlayerChange?.(song);
  };

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSongForPlaylist(song);
    setShowPlaylistModal(true);
  };

  const handleAddSongToPlaylist = async (playlistId: string) => {
    if (!selectedSongForPlaylist) return;

    try {
      await playlistsAPI.addSong(playlistId, selectedSongForPlaylist.id);
      
      // Refresh playlists
      const updated = await playlistsAPI.getUserPlaylists();
      setUserPlaylists(updated);
      
      setShowPlaylistModal(false);
      setSelectedSongForPlaylist(null);
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
    }
  };

  return (
    <div className="content">
      {/* Header */}
      <div className="content-header">
        <h1>🎵 Your Music Library</h1>
        <p>Discover and stream your favorite tracks</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading songs...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSongs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <h3>No songs found</h3>
          <p className="empty-state-text">
            {searchQuery
              ? `Try searching for different keywords`
              : `Your music library is empty. Add some songs to get started!`}
          </p>
        </div>
      )}

      {/* Song Grid */}
      {!isLoading && filteredSongs.length > 0 && (
        <div className="grid">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={handlePlaySong}
              onAddToPlaylist={handleAddToPlaylist}
              isPlaying={currentSong?.id === song.id}
            />
          ))}
        </div>
      )}

      {/* Add to Playlist Modal */}
      {showPlaylistModal && selectedSongForPlaylist && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
        }}>
          <div style={{
            background: 'rgba(28, 28, 30, 0.95)',
            backdrop filter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '70vh',
            overflow: 'auto',
          }}>
            <h3 style={{ marginBottom: '16px' }}>Add to Playlist</h3>
            
            {userPlaylists.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddSongToPlaylist(playlist.id)}
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                  >
                    {playlist.name}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                No playlists yet. Create one first!
              </p>
            )}

            <button
              onClick={() => setShowPlaylistModal(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
