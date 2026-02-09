/**
 * Player Bar Component
 * Global persistent music player with controls and playback management
 */

import { songsAPI } from '@/api/songsAPI';
import type { Song } from "@/types/api";
import { formatDuration } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import '../styles/player.css';

interface PlayerBarProps {
  song: Song | null;
  onPrevious?: () => void;
  onNext?: () => void;
  onPlaylistClick?: () => void;
}

const PlayerBar = ({ 
  song, 
  onPrevious, 
  onNext, 
  onPlaylistClick 
}: PlayerBarProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update audio element when song changes
  useEffect(() => {
    if (!song || !audioRef.current) return;

    const audio = audioRef.current;
    const streamUrl = songsAPI.getStreamUrl(song.id);

    setIsLoading(true);
    audio.src = streamUrl;
    
    // Auto-play when song changes
    audio.play().catch(() => {
      setIsPlaying(false);
    });
    
    setIsPlaying(true);
  }, [song]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => onNext?.();

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onNext]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const normalizedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(normalizedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = normalizedVolume;
    }
    
    if (normalizedVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  if (!song) {
    return (
      <div className="player-bar empty">
        <div className="player-placeholder">
          <p>No song playing</p>
          <span>Select a song to start listening</span>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const coverUrl = songsAPI.getCoverUrl(song.coverPath);

  return (
    <div className="player-bar">
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Left: Song Info */}
      <div className="player-song-info">
        <div className="player-cover">
          {coverUrl && (
            <img src={coverUrl} alt={song.title} onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          )}
          <div className="cover-placeholder">
            <span>♪</span>
          </div>
        </div>

        <div className="player-details">
          <h4 className="player-title">{song.title}</h4>
          <p className="player-artist">{song.artist}</p>
          {song.album && <p className="player-album">{song.album}</p>}
        </div>
      </div>

      {/* Center: Controls */}
      <div className="player-controls">
        {/* Progress Bar */}
        <div className="player-progress-container">
          <span className="time-label">{formatDuration(currentTime)}</span>
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="progress-slider"
              aria-label="Seek"
            />
          </div>

          <span className="time-label">{formatDuration(duration)}</span>
        </div>

        {/* Playback Buttons */}
        <div className="playback-buttons">
          <button
            className="player-button"
            onClick={onPrevious}
            title="Previous track"
            aria-label="Previous"
            disabled={!onPrevious}
          >
            ⏮
          </button>

          <button
            className={`player-button play-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
          </button>

          <button
            className="player-button"
            onClick={onNext}
            title="Next track"
            aria-label="Next"
            disabled={!onNext}
          >
            ⏭
          </button>
        </div>
      </div>

      {/* Right: Volume & Settings */}
      <div className="player-volume-control">
        <button
          className="player-button volume-button"
          onClick={handleMuteToggle}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="volume-slider"
          title="Volume"
          aria-label="Volume"
        />

        <button
          className="player-button"
          onClick={onPlaylistClick}
          title="Show queue"
          aria-label="Queue"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default PlayerBar;
