/**
 * Songs API Service
 * Handles song retrieval, searching, and audio streaming
 */

import { API_CONFIG } from '@/config';
import type { Song } from '@/types/api';
import { apiClient } from './client';

const endpoint = API_CONFIG.ENDPOINTS.SONGS;

export const songsAPI = {
  /**
   * Get all active songs (public endpoint, no auth required)
   */
  getAllSongs: async (): Promise<Song[]> => {
    try {
      const response = await apiClient.get<Song[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      return [];
    }
  },

  /**
   * Get a specific song by ID (requires authentication)
   */
  getSongById: async (id: string): Promise<Song> => {
    const response = await apiClient.get<Song>(`${endpoint}/${id}`);
    return response.data;
  },

  /**
   * Search songs by artist name
   * @param artist - Artist name query
   */
  searchByArtist: async (artist: string): Promise<Song[]> => {
    const response = await apiClient.get<Song[]>(
      `${endpoint}/search/artist`,
      { params: { artist } }
    );
    return response.data;
  },

  /**
   * Search songs by title
   * @param title - Song title query
   */
  searchByTitle: async (title: string): Promise<Song[]> => {
    const response = await apiClient.get<Song[]>(
      `${endpoint}/search/title`,
      { params: { title } }
    );
    return response.data;
  },

  /**
   * Search songs by genre
   * @param genre - Genre query
   */
  searchByGenre: async (genre: string): Promise<Song[]> => {
    const response = await apiClient.get<Song[]>(
      `${endpoint}/search/genre`,
      { params: { genre } }
    );
    return response.data;
  },

  /**
   * Get audio stream URL for a song
   * Uses public /media/audio endpoint (no JWT required)
   * Supports HTTP Range requests for seeking
   * @param audioPath - Audio file path from Song response (e.g., "storage/audio/UUID_filename.mp3" or "storage\audio\UUID_filename.mp3" on Windows)
   * @returns URL for streaming audio with just the filename
   */
  getStreamUrl: (audioPath: string | null | undefined): string => {
    if (!audioPath) {
      console.warn('getStreamUrl called with missing audioPath:', audioPath);
      return '';
    }

    // Extract filename from audioPath
    // Handles both forward slashes (Unix/returned) and backslashes (Windows paths)
    // Examples:
    // "storage/audio/UUID_Oru_Pere_Varalaaru.mp3" → "UUID_Oru_Pere_Varalaaru.mp3"
    // "storage\audio\UUID_Oru_Pere_Varalaaru.mp3" → "UUID_Oru_Pere_Varalaaru.mp3"
    // "UUID_Oru_Pere_Varalaaru.mp3" → "UUID_Oru_Pere_Varalaaru.mp3"
    
    // Split by either / or \ and get the last part
    const parts = audioPath.replace(/\\/g, '/').split('/');
    const filename = parts[parts.length - 1]?.trim() || '';
    
    if (!filename) {
      console.warn('Could not extract filename from audioPath:', audioPath);
      return '';
    }

    const url = `${API_CONFIG.BASE_URL}/media/audio/${filename}`;
    return url;
  },

  /**
   * Get cover image URL for a song
   * @param coverPath - Path to cover image from response
   * @returns Full URL to cover image
   */
  getCoverUrl: (coverPath: string | null): string | null => {
    if (!coverPath) return null;
    
    // coverPath is relative like 'storage/covers/xxx.jpg'
    return `${API_CONFIG.BASE_URL}/${coverPath}`;
  },

  /**
   * Get audio file URL from media endpoint (public)
   * @param filename - Audio filename
   * @returns Full URL to audio file
   */
  getAudioUrl: (filename: string): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDIA}/audio/${filename}`;
  },

  /**
   * Delete a song (admin only)
   * @param songId - Song UUID
   */
  deleteSong: async (songId: string): Promise<void> => {
    await apiClient.delete(`/api/admin/songs/${songId}`);
  },
};
