/**
 * Type definitions for API responses and domain models
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  genre: string;
  durationSeconds: number;
  audioPath: string;
  coverPath: string | null;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
  songs: Song[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Player state
 */
export interface PlayerState {
  currentSong: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  loop: 'off' | 'one' | 'all';
  shuffle: boolean;
}

export interface PlaylistSong extends Song {
  position: number;
}
