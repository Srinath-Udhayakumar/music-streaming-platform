/**
 * Playlists API Service
 * Handles playlist CRUD operations and song management
 */

import { API_CONFIG } from '@/config';
import type { Playlist } from '@/types/api';
import { apiClient } from './client';

const endpoint = API_CONFIG.ENDPOINTS.PLAYLISTS;

export const playlistsAPI = {
  /**
   * Create a new playlist for the current user
   * @param name - Playlist name
   */
  create: async (name: string): Promise<Playlist> => {
    const response = await apiClient.post<Playlist>(
      endpoint,
      {},
      { params: { name } }
    );
    return response.data;
  },

  /**
   * Get all playlists for the current user
   */
  getUserPlaylists: async (): Promise<Playlist[]> => {
    const response = await apiClient.get<Playlist[]>(endpoint);
    return response.data;
  },

  /**
   * Get a specific playlist by ID
   */
  getPlaylist: async (playlistId: string): Promise<Playlist> => {
    const response = await apiClient.get<Playlist>(
      `${endpoint}/${playlistId}`
    );
    return response.data;
  },

  /**
   * Add a song to a playlist
   * @param playlistId - Playlist UUID
   * @param songId - Song UUID
   */
  addSong: async (playlistId: string, songId: string): Promise<void> => {
    await apiClient.post(
      `${endpoint}/${playlistId}/songs/${songId}`
    );
  },

  /**
   * Remove a song from a playlist
   * @param playlistId - Playlist UUID
   * @param songId - Song UUID
   */
  removeSong: async (playlistId: string, songId: string): Promise<void> => {
    await apiClient.delete(
      `${endpoint}/${playlistId}/songs/${songId}`
    );
  },

  /**
   * Check if a song is in a playlist
   */
  hasSong: (playlist: Playlist, songId: string): boolean => {
    return playlist.songs.some(song => song.id === songId);
  },
};
