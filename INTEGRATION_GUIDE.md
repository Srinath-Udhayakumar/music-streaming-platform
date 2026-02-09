# Frontend-Backend Integration Guide

## Quick Start

### 1. Backend Prerequisites

Your Spring Boot backend must be running on `http://localhost:8081` with:
- PostgreSQL database initialized
- CORS configured for `http://localhost:5173`
- JWT secret configured in `application.yml`

### 2. Frontend Setup

```bash
cd frontend/music-streaming-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## API Endpoint Summary

All endpoints use JWT authentication (except `/auth/login` and `GET /api/songs`)

### Authentication
```
POST /api/auth/login
  Body: { email, password }
  Returns: { token: "JWT_TOKEN", tokenType: "Bearer" }
```

### Songs
```
GET    /api/songs                        → Song[]
GET    /api/songs/{id}                   → Song (requires JWT)
GET    /api/songs/search/artist?artist=X → Song[] (requires JWT)
GET    /api/songs/search/title?title=X   → Song[] (requires JWT)
GET    /api/songs/search/genre?genre=X   → Song[] (requires JWT)
GET    /api/stream/songs/{id}            → audio/mpeg (requires JWT)
```

### Playlists
```
POST   /api/playlists?name=X              → Playlist (requires JWT)
GET    /api/playlists                     → Playlist[] (requires JWT)
POST   /api/playlists/{id}/songs/{songId} → void (requires JWT)
DELETE /api/playlists/{id}/songs/{songId} → void (requires JWT)
```

---

## JWT Handling

### Automatic JWT Attachment

Every API request automatically includes the JWT token in the Authorization header:

```typescript
// Axios Interceptor (api/client.ts)
Authorization: Bearer {token}
```

### Token Storage

- **Storage Location**: `localStorage` with key `music_app_token`
- **Token Extraction**: From `/api/auth/login` response
- **Token Parsing**: `parseJwt()` extracts user info
- **Token Expiration**: 30 minutes (backend configured)

### Handling Expiration

When a token expires:
1. Backend returns `401 Unauthorized`
2. Axios interceptor catches it
3. localStorage is cleared
4. logout event is dispatched
5. User automatically redirected to login

---

## Common Development Tasks

### Adding a New Song Search Feature

**Backend Already Supports**:
- `/api/songs/search/artist?artist=Beatles`
- `/api/songs/search/title?title=Hey%20Jude`
- `/api/songs/search/genre?genre=Rock`

**Frontend Implementation**:

```typescript
// Use existing songsAPI functions
const results = await songsAPI.searchByArtist("Beatles");
const results = await songsAPI.searchByTitle("Song Title");
const results = await songsAPI.searchByGenre("Rock");
```

### Playing a Song

```typescript
import { songsAPI } from '@/api';

// Get stream URL
const streamUrl = songsAPI.getStreamUrl(songId);

// Use in audio element
<audio src={streamUrl} controls />
```

### Managing Playlists

```typescript
import { playlistsAPI } from '@/api';

// Create playlist
const playlist = await playlistsAPI.create("My Favorites");

// Get all playlists
const playlists = await playlistsAPI.getUserPlaylists();

// Add song to playlist
await playlistsAPI.addSong(playlistId, songId);

// Remove song from playlist
await playlistsAPI.removeSong(playlistId, songId);

// Check if song is in playlist
const hasIt = playlistsAPI.hasSong(playlist, songId);
```

---

## Debugging API Issues

### Check JWT Token

```typescript
// In browser console
localStorage.getItem('music_app_token')
// Copy token and decode at jwt.io
```

### Monitor API Calls

**Network Tab in DevTools**:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Look for API requests
5. Check request headers and response

**Axios Interceptor Debug**:
```typescript
// Add to api/client.ts for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('[API Response]', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('[API Error]', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);
```

### Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response normally |
| 400 | Bad Request | Check request format/parameters |
| 401 | Unauthorized | Token missing/expired - re-login |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend issue |

---

## Environment Variables

### Development (.env)
```
VITE_API_BASE_URL=http://localhost:8081
VITE_API_TIMEOUT=30000
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://api.yourprodomain.com
VITE_API_TIMEOUT=30000
```

**Note:** `VITE_` prefix makes variables accessible to frontend. They're embedded at build time.

---

## Extending the Frontend

### Adding a New Page

1. Create component in `src/pages/MyPage.tsx`
2. Add route in `App.tsx`
3. Wrap with `<ProtectedRoute>` if authentication needed
4. Import necessary API functions

```typescript
// src/pages/MyPage.tsx
import { useAuth } from '@/auth/AuthContext';
import { songsAPI } from '@/api';

export default function MyPage() {
  const { user } = useAuth();
  
  // Your component logic
  return <div>My Page</div>;
}
```

### Adding a New Component

1. Create in `src/components/MyComponent.tsx`
2. Define TypeScript interfaces for props
3. Import styles from `src/styles/components.css`
4. Export as default

```typescript
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Adding Styling

1. Add CSS to appropriate file in `src/styles/`
2. Use BEM naming convention: `.block__element--modifier`
3. Include media queries for responsiveness
4. Test on mobile/tablet/desktop

```css
.my-component {
  padding: 16px;
}

.my-component__title {
  font-weight: 600;
}

.my-component__title--highlighted {
  color: #667eea;
}

@media (max-width: 768px) {
  .my-component {
    padding: 12px;
  }
}
```

---

## Performance Optimization Tips

### React Optimization
- Use `useCallback` for event handlers
- Use `useMemo` for expensive calculations
- Avoid inline object/array creation in render
- Use React DevTools Profiler to identify slow renders

### API Optimization
- Cache results when appropriate
- Implement request debouncing for search
- Use pagination for large lists
- Consider infinite scroll instead of loading all

### Bundle Optimization
- Code-split routes with React.lazy()
- Tree-shake unused exports
- Use dynamic imports for heavy components
- Monitor bundle size: `npm run build`

---

## Testing (Manual)

### Authentication Flow
1. Go to `http://localhost:5173`
2. You should be redirected to login
3. Enter credentials and click sign in
4. Should redirect to home with songs displayed
5. Click logout in sidebar
6. Should redirect to login

### Song Grid
1. Verify all songs display with covers
2. Click a song - should highlight and play
3. Try search - should filter songs
4. Hover over song - play button should appear
5. Click menu (⋯) - add to playlist option

### Player
1. Select a song from grid
2. Player should show song info
3. Click play/pause - should work
4. Drag progress bar - should seek
5. Change volume - indicator should update
6. Click next/previous - should change song

### Add to Playlist
1. Click ⋯ on song card
2. Click "Add to Playlist"
3. Modal should show available playlists
4. Click a playlist - song should be added
5. Go to playlists section - song should appear

---

## Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Setup HTTPS certificates
- [ ] Configure backend CORS for production domain
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy `dist/` folder to hosting
- [ ] Test all features on production
- [ ] Setup monitoring/error tracking
- [ ] Configure CDN for static assets

---

## Support & Escalation

### Issue: Token Not Being Sent

**Debug**:
1. Open DevTools → Application → Local Storage
2. Look for `music_app_token` key
3. If empty: Token not saved after login
4. If present: Check Network tab - Authorization header included?

**Fix**:
- Verify login response contains `{ token, tokenType }`
- Check auth interceptor is properly configured
- Ensure localStorage isn't being cleared

### Issue: 401 on All Requests Except Login

**Probable Cause**: Token expired (30 minutes)

**Solutions**:
- User must re-login
- Or implement refresh token flow (backend enhancement)

### Issue: Playlist Operations Fail

**Debug**:
1. Check playlist ID is valid UUID
2. Verify song exists in system
3. Check Network tab for response error

**Common Errors**:
- `404 Not Found` - Playlist or song doesn't exist
- `403 Forbidden` - User doesn't own playlist
- `400 Bad Request` - Song already in playlist

---

## Questions to Ask

**For Backend Developers**:
- Can we implement refresh token flow?
- Is pagination available for large song lists?
- Can we add real-time notifications for playlists?

**For DevOps/SRE**:
- How do we scale audio streaming?
- What are the bandwidth requirements?
- Should we use CDN for covers/audio?

**For Product Management**:
- Should we cache user's most recent playlists?
- Do we need real-time collaborative playlists?
- Should we add social features (sharing, follows)?

