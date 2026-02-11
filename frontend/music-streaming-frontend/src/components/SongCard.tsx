/**
 * Song Card Component
 * Displays song information in grid format (Apple Music style)
 * Includes play, playlist, and admin delete actions
 */

import { songsAPI } from '@/api/songsAPI';
import type { Song } from '@/types/api';
import { formatDuration } from '@/utils/helpers';
import { useState } from 'react';
import '../styles/song-card.css';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  onDelete?: (song: Song) => void;
  isPlaying?: boolean;
  isAdmin?: boolean;
}

const SongCard = ({ 
  song, 
  onPlay, 
  onAddToPlaylist,
  onDelete,
  isPlaying = false,
  isAdmin = false
}: SongCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const coverUrl = songsAPI.getCoverUrl(song.coverPath);
  const placeholderBg = `linear-gradient(135deg, #1a1a1a 0%, #242424 100%)`;

  return (
    <div 
      className={`song-card ${isPlaying ? 'playing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
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
        {isHovered && (
          <div className="song-card-overlay">
            <button 
              className="play-button"
              onClick={() => onPlay(song)}
              title="Play song"
              aria-label={`Play ${song.title}`}
            >
              ▶
            </button>
          </div>
        )}

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
      {(onAddToPlaylist || (isAdmin && onDelete)) && (
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
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              {onAddToPlaylist && (
                <button 
                  onClick={() => {
                    onAddToPlaylist(song);
                    setShowMenu(false);
                  }}
                  className="menu-item"
                >
                  Add to Playlist
                </button>
              )}
              {isAdmin && onDelete && (
                <button 
                  onClick={() => {
                    onDelete(song);
                    setShowMenu(false);
                  }}
                  className="menu-item danger"
                >
                  Delete Song
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongCard;
