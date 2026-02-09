
/**
 * DEPRECATED: Legacy Song type
 * Use @/types/api.ts instead
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  durationSeconds: number;
  audioPath: string;
  coverPath?: string;
} 
