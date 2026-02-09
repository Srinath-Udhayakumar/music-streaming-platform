/**
 * Song Card Component
 * Displays song information in grid format (Apple Music style)
 */

import { useState } from 'react';
import type { Song } from '@/types/api';
import { formatDuration } from '@/utils/helpers';
import { songsAPI } from '@/api/songsAPI';
import '../styles/components.css';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  isPlaying?: boolean;
}

const SongCard = ({ 
  song, 
  onPlay, 
  onAddToPlaylist,
  isPlaying = false
}: SongCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const coverUrl = songsAPI.getCoverUrl(song.coverPath);
  const placeholderBg = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;

  return (
    <div className={`song-card ${isPlaying ? 'playing' : ''}`}>
      {/* Cover Image */}
      <div 
        className="song-card-image"
        style={!coverUrl || imageError ? { background: placeholderBg } : undefined}
      >
        {coverUrl && !imageError && (
          <img
            src={coverUrl}
            alt={song.title}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Overlay with Play Button */}
        <div className="song-card-overlay">
          <button 
            className="play-button"
            onClick={() => onPlay(song)}
            title="Play song"
            aria-label={`Play ${song.title}`}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>

        {/* Now Playing Indicator */}
        {isPlaying && (
          <div className="now-playing-badge">
            <span className="visualizer">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="song-card-content">
        <h3 className="song-title" title={song.title}>{song.title}</h3>
        <p className="song-artist" title={song.artist}>{song.artist}</p>
        
        {/* Album and Duration */}
        <div className="song-meta">
          {song.album && (
            <span className="meta-item" title={song.album}>
              {song.album}
            </span>
          )}
          <span className="meta-item">
            {formatDuration(song.durationSeconds)}
          </span>
        </div>
      </div>

      {/* Menu Button */}
      {onAddToPlaylist && (
        <div className="song-card-menu">
          <button
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
            title="More options"
            aria-label="Song options"
          >
            ⋯
          </button>

          {showMenu && (
            <div className="menu-dropdown">
              <button 
                onClick={() => {
                  onAddToPlaylist(song);
                  setShowMenu(false);
                }}
                className="menu-item"
              >
                Add to Playlist
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongCard;
