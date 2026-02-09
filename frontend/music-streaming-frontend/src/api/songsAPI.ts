/**
 * Songs API Service
 * Handles song retrieval, searching, and audio streaming
 */

import { apiClient } from './client';
import { API_CONFIG } from '@/config';
import type { Song } from '@/types/api';

const endpoint = API_CONFIG.ENDPOINTS.SONGS;
const streamEndpoint = API_CONFIG.ENDPOINTS.STREAM;

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
   * Supports HTTP Range requests for seeking
   * @param songId - UUID of the song
   * @returns URL for streaming audio
   */
  getStreamUrl: (songId: string): string => {
    return `${API_CONFIG.BASE_URL}${streamEndpoint}/songs/${songId}`;
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
};
