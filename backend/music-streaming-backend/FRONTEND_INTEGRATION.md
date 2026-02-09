# Frontend Integration Guide

## Quick Start: Consuming the Music Streaming API

This guide helps your React/TypeScript frontend properly integrate with the refactored backend.

---

## 🔑 **Key Endpoints**

### **1. Song List (Public)**
```
GET /api/songs
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Oru Pere Varalaaru",
    "artist": "Adi Shankaracharya",
    "album": "Classical Melodies",
    "genre": "Classical",
    "durationSeconds": 180,
    "audioPath": "storage/audio/2bae23d4-b141-4f19-a59f-3e5adc1f3015_Oru_Pere_Varalaaru.mp3",
    "coverPath": "storage/covers/cafd0551-c83a-4c14-a889-d0a7a2e09b0b_Oru_Pere_Varalaaru_Thumb.png"
  },
  ...
]
```

**Usage (React + Axios):**
```typescript
import axios from 'axios';

const fetchSongs = async () => {
  try {
    const response = await axios.get('http://localhost:8081/api/songs');
    console.log('Songs:', response.data);
    // response.data is an array of SongResponse
  } catch (error) {
    console.error('Failed to fetch songs:', error);
  }
};
```

---

### **2. Audio Streaming (Public)**
```
GET /media/audio/{filename}
Content-Type: audio/mpeg
```

**Usage (HTML5):**
```tsx
interface Song {
  id: string;
  title: string;
  artist: string;
  audioPath: string; // e.g., "storage/audio/2bae23d4-b141-4f19-a59f-3e5adc1f3015_Oru_Pere_Varalaaru.mp3"
  durationSeconds: number;
  // ... other fields
}

function SongPlayer({ song }: { song: Song }) {
  const audioUrl = `http://localhost:8081/media/audio/${extractFilename(song.audioPath)}`;
  
  return (
    <audio controls>
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}

// Extract filename from full path: "storage/audio/UUID_filename.mp3" → "UUID_filename.mp3"
function extractFilename(audioPath: string): string {
  return audioPath.split('/').pop() || '';
}
```

---

### **3. Song Search (Protected)**
```
GET /api/songs/search/title?title=query
GET /api/songs/search/artist?artist=query
GET /api/songs/search/genre?genre=query

Headers:
  Authorization: Bearer <JWT_TOKEN>
```

**Response:** Same format as song list

**Usage (React + Axios with Token):**
```typescript
const searchSongs = async (query: string, type: 'title' | 'artist' | 'genre') => {
  const token = localStorage.getItem('jwtToken'); // Stored from login
  
  try {
    const response = await axios.get(
      `http://localhost:8081/api/songs/search/${type}?${type}=${query}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Search results:', response.data);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

---

### **4. Login (Public)**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer"
}
```

**Usage (React):**
```typescript
import axios from 'axios';

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:8081/api/auth/login', {
      email,
      password
    });
    
    const { token, type } = response.data;
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('tokenType', type);
    
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

## 🔐 **CORS & Headers**

### **Allowed Origins:**
- `http://localhost:5173` (your React app)

### **Allowed Methods:**
- `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

### **Allowed Headers:**
- `Authorization` - For JWT tokens
- `Content-Type` - For request bodies
- All other headers (wildcard)

### **Credentials:**
- Cookies/credentials are **allowed**

**Setup in Your React App:**
```typescript
// Create an Axios instance with default headers
const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true, // Include credentials
});

// Add JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## 🎵 **Complete Example: Song Player Component**

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SongResponse {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  durationSeconds: number;
  audioPath: string;
  coverPath: string;
}

const SongsList: React.FC = () => {
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongResponse | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/songs');
      setSongs(response.data);
    } catch (err) {
      setError('Failed to load songs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractFilename = (path: string): string => {
    return path.split('/').pop() || '';
  };

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Music Streaming</h1>

      {selectedSong && (
        <div style={{
          border: '1px solid #ccc',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px'
        }}>
          <h2>{selectedSong.title}</h2>
          <p><strong>Artist:</strong> {selectedSong.artist}</p>
          <p><strong>Album:</strong> {selectedSong.album || 'Unknown'}</p>
          <p><strong>Genre:</strong> {selectedSong.genre}</p>
          
          {selectedSong.coverPath && (
            <img
              src={`http://localhost:8081/${selectedSong.coverPath}`}
              alt="Album Cover"
              style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '10px' }}
            />
          )}

          <audio
            controls
            style={{ width: '100%', marginBottom: '10px' }}
            autoPlay
          >
            <source
              src={`http://localhost:8081/media/audio/${extractFilename(selectedSong.audioPath)}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>

          <button
            onClick={() => setSelectedSong(null)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close Player
          </button>
        </div>
      )}

      <div>
        <h3>Available Songs ({songs.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => setSelectedSong(song)}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s',
                boxShadow: selectedSong?.id === song.id ? '0 0 10px blue' : 'none'
              }}
            >
              {song.coverPath && (
                <img
                  src={`http://localhost:8081/${song.coverPath}`}
                  alt={song.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                />
              )}
              <h4>{song.title}</h4>
              <p style={{ margin: '5px 0', color: '#666' }}>{song.artist}</p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                {Math.floor(song.durationSeconds / 60)}:{String(song.durationSeconds % 60).padStart(2, '0')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongsList;
```

---

## 📋 **Common Patterns**

### **API Error Handling**
```typescript
try {
  const response = await axios.get('http://localhost:8081/api/songs');
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle API errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwtToken');
      // Redirect to login
    } else if (error.response?.status === 403) {
      // Access denied
      console.error('Permission denied');
    } else if (error.response?.status === 404) {
      // Resource not found
      console.error('Song not found');
    } else {
      // Other errors
      console.error('Error:', error.response?.data);
    }
  }
}
```

### **Handling File Paths**
```typescript
// Backend returns full paths like: "storage/audio/UUID_filename.mp3"
// Extract just the filename for the media endpoint:

const getAudioUrl = (audioPath: string): string => {
  const filename = audioPath.split('/').pop();
  return `http://localhost:8081/media/audio/${filename}`;
};

const getCoverUrl = (coverPath: string | null): string | null => {
  if (!coverPath) return null;
  return `http://localhost:8081/${coverPath}`;
};
```

---

## ✅ **Verification Checklist**

- [ ] Songs list loads without errors
- [ ] Clicking a song displays it in the player
- [ ] Audio plays correctly (no blank screen)
- [ ] No CORS errors in browser console
- [ ] No 401/403 errors for public endpoints
- [ ] Album covers display properly
- [ ] Song duration displays correctly
- [ ] Search requires login but works when authenticated

---

## 🚨 **Common Issues & Solutions**

### **CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure backend CORS is configured for `http://localhost:5173`

### **Audio Not Playing**
```
Error: Cannot load media from /media/audio/filename.mp3
```
**Solution:** 
- Check that filename is extracted correctly from `audioPath`
- Verify file exists in `storage/audio/` directory
- Check browser console for detailed error

### **401 Unauthorized**
```
"Authentication failed"
```
**Solution:**
- For public endpoints (song list, audio), no token needed
- For protected endpoints (search), include `Authorization: Bearer <token>` header
- Check token is stored and valid

---

## 📞 **API Base Configuration**

**Update your API configuration once:**
```typescript
// config/api.ts
export const API_BASE_URL = 'http://localhost:8081';
export const AUTH_HEADER = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});
```

**Use throughout your app:**
```typescript
import { API_BASE_URL, AUTH_HEADER } from '../config/api';

const token = localStorage.getItem('jwtToken');
const response = await axios.get(`${API_BASE_URL}/api/songs/search/title?title=query`, {
  headers: AUTH_HEADER(token)
});
```

---

This guide ensures seamless integration between your React frontend and the refactored Spring Boot backend. ✨

