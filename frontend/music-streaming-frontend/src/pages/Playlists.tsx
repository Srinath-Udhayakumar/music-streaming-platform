/**
 * Playlists Page Component
 * View and manage user playlists
 * Apple Music-inspired design
 */

import { playlistsAPI } from '@/api/playlistsAPI';
import SongCard from '@/components/SongCard';
import type { Playlist, Song } from '@/types/api';
import { useEffect, useState } from 'react';
import '../styles/content-page.css';

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Load playlists on mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await playlistsAPI.getUserPlaylists();
      setPlaylists(data);
      if (data.length > 0 && !selectedPlaylist) {
        setSelectedPlaylist(data[0]);
      }
    } catch (err) {
      setError('Failed to load playlists');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      return;
    }

    try {
      const newPlaylist = await playlistsAPI.create(newPlaylistName.trim());
      setPlaylists([...playlists, newPlaylist]);
      setSelectedPlaylist(newPlaylist);
      setNewPlaylistName('');
      setShowCreateModal(false);
    } catch (err) {
      setError('Failed to create playlist');
      console.error(err);
    }
  };

  const handlePlaySong = async (song: Song) => {
    setCurrentSong(song);
  };

  const handleRemoveSongFromPlaylist = async (song: Song) => {
    if (!selectedPlaylist) return;

    try {
      await playlistsAPI.removeSong(selectedPlaylist.id, song.id);
      const updated = await playlistsAPI.getPlaylist(selectedPlaylist.id);
      setSelectedPlaylist(updated);
      
      // Update in list
      setPlaylists(playlists.map(p => 
        p.id === selectedPlaylist.id ? updated : p
      ));
    } catch (err) {
      setError('Failed to remove song from playlist');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="content">
        <div className="content-header">
          <h1>My Playlists</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {/* Header */}
      <div className="content-header">
        <div className="header-title">
          <h1>My Playlists</h1>
          <p>Organize and enjoy your favorite tracks</p>
        </div>
        <button 
          className="primary-button"
          onClick={() => setShowCreateModal(true)}
        >
          + New Playlist
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-container">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Playlist</h2>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="playlist-name-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreatePlaylist();
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="secondary-button"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="primary-button"
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {playlists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <h2>No Playlists Yet</h2>
          <p>Create your first playlist to organize your favorite tracks</p>
          <button 
            className="primary-button"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Playlist
          </button>
        </div>
      ) : (
        <div className="playlists-layout">
          {/* Playlists Sidebar */}
          <div className="playlists-sidebar">
            <h3>Your Playlists</h3>
            <ul className="playlists-list">
              {playlists.map(playlist => (
                <li 
                  key={playlist.id}
                  className={`playlist-item ${selectedPlaylist?.id === playlist.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <div className="playlist-icon">🎵</div>
                  <div>
                    <div className="playlist-name">{playlist.name}</div>
                    <div className="playlist-count">
                      {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Playlist View */}
          {selectedPlaylist && (
            <div className="playlist-view">
              <div className="playlist-header">
                <div className="playlist-cover">🎵</div>
                <div>
                  <h2>{selectedPlaylist.name}</h2>
                  <p>{selectedPlaylist.songs.length} song{selectedPlaylist.songs.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {selectedPlaylist.songs.length === 0 ? (
                <div className="empty-state">
                  <p>No songs in this playlist yet</p>
                </div>
              ) : (
                <div className="grid">
                  {selectedPlaylist.songs.map(song => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onPlay={handlePlaySong}
                      onDelete={handleRemoveSongFromPlaylist}
                      isPlaying={currentSong?.id === song.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Playlists;
