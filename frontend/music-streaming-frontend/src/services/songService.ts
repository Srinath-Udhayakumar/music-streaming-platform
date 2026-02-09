/**
 * Legacy Song Service (DEPRECATED)
 * Use songsAPI from @/api/songsAPI instead
 * 
 * Kept for backward compatibility only
 */

import { songsAPI } from '@/api/songsAPI';
import type { Song } from '@/types/api';

export const getSongs = async (): Promise<Song[]> => {
  return songsAPI.getAllSongs();
};
