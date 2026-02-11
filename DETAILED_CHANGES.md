# Apple Music UI Clone - Detailed Change Reference

## Quick Access to All Changes

### 1. Design System (NEW)
**File**: `src/design/tokens.ts`
- Complete design tokens for Apple Music
- Colors, spacing, typography, shadows, animations
- All CSS-in-JS ready constants

### 2. Authentication Pages

#### Registration Page (NEW)
**File**: `src/pages/Register.tsx`
- Complete signup with email validation
- Password and confirm password fields
- Error/success states
- Links to login page
- Connects to `/api/auth/register`

#### Login Page (UPDATED)
**File**: `src/pages/Login.tsx`
- Added "Sign Up" link
- Updated header text to "♪ Music Streaming"
- New footer with register link
- Styled error messages with new red color

### 3. Content Pages

#### Browse/Explore Page (NEW)
**File**: `src/pages/Browse.tsx`
- Genre-based browsing
- Search across all fields
- Filter buttons for genres
- Grid layout with SongCards
- Songs count display

#### Library Page (NEW)
**File**: `src/pages/Library.tsx`
- Full song library with search
- Sort options: Title, Artist, Album, Duration
- Grid display
- Song count indicator
- Empty state in search

#### Playlists Page (NEW)
**File**: `src/pages/Playlists.tsx`
- View all playlists
- Create new playlists
- Modal dialog
- Playlist sidebar selector
- Add/remove songs
- Drag-and-drop ready structure

### 4. Components

#### SongCard (UPDATED)
**File**: `src/components/SongCard.tsx`
**Changes**:
```typescript
// Added props
isAdmin?: boolean;
onDelete?: (song: Song) => void;

// Added delete button rendering
{isAdmin && onDelete && (
  <button onClick={() => onDelete(song)} className="menu-item danger">
    Delete Song
  </button>
)}

// Improved hover states
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
```

#### Sidebar (UPDATED)
**File**: `src/components/Sidebar.tsx`
**Changes**:
```typescript
// Admin-only menu items
...(user?.role === 'ADMIN' ? [
  { id: 'upload', label: 'Add Song', path: '/admin/upload', icon: '⬆', adminOnly: true },
  { id: 'manage', label: 'Manage Songs', path: '/admin/manage', icon: '⚙', adminOnly: true },
] : []),

// Class name for styling
className={`menu-link ... ${section.adminOnly ? 'admin-only' : ''}`}
```

### 5. Styles

#### Global Styles (UPDATED)
**File**: `src/index.css`
**Changes**:
- Color scheme: `#FA243C` (red) throughout
- Increased sidebar width: `280px`
- Improved scrollbar: `12px` width, rounded
- Spinner color: red instead of purple
- Maintained responsive breakpoints

#### Auth Styles (UPDATED)
**File**: `src/styles/auth.css`
**Changes**:
- Button background: `#FA243C` → `#FF5A5B` → `#E01E2D`
- Focus box-shadow: red color
- Error messages: `#FF453A`
- Added `.success-card` and `.success-icon`
- Added `.auth-error` and `.auth-footer` classes
- Blob colors updated to red/pink

#### Sidebar Styles (UPDATED)
**File**: `src/styles/sidebar.css`
**Changes**:
- Logo color: white (removed gradient)
- Active indicator: `#FA243C` red bar
- User avatar: `#FA243C` background
- Logout button: `#FF453A` red text
- Added `.admin-only` styling for admin menu items
- Z-index: `200` for proper layering

#### SongCard Styles (NEW)
**File**: `src/styles/song-card.css`
- Complete styling for song cards
- Play button overlay effects
- Menu dropdown with animations
- "Now Playing" badge with visualizer
- Responsive grid adjustments

#### Content Pages Styles (NEW)
**File**: `src/styles/content-page.css`
- Modal dialogs and overlays
- Playlist layout (sidebar + main)
- Search and sort controls
- Category buttons
- Empty states
- Responsive design

#### ProtectedRoute Fix (UPDATED)
**File**: `src/auth/ProtectedRoute.tsx`
**Changes**:
```typescript
// Before
import { ReactNode } from 'react';

// After
import { type ReactNode } from 'react';
```

### 6. Router Configuration

#### Main App Component (UPDATED)
**File**: `src/App.tsx`
**Changes**:
```typescript
// New imports added
import Browse from '@/pages/Browse';
import Library from '@/pages/Library';
import Playlists from '@/pages/Playlists';
import Register from '@/pages/Register';

// New routes added
<Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
<Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
<Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />

// Auth routes
<Route path="/register" element={<Register />} />
```

## Key Implementation Details

### Color Implementation
```css
Primary Red: #FA243C
Hover Red: #FF5A5B
Active/Pressed: #E01E2D
Error Red: #FF453A

Background: #000000
Secondary: #1a1a1a
Tertiary: #242424

Text Primary: #FFFFFF
Text Secondary: rgba(255,255,255,0.6)
```

### Typography Stack
```css
font-family: -apple-system, BlinkMacSystemFont,
             "Segoe UI", "Roboto Flex", Roboto, Oxygen,
             Ubuntu, Cantarell, "Fira Sans",
             "Droid Sans", sans-serif;
```

### Spacing Grid
```
xs: 4px
sm: 8px (base)
md: 12px
lg: 16px
xl: 24px
xxl: 32px
```

### Z-Index Layers
```
base: 0
dropdown: 100
sticky: 200
sidebar: 200
playerBar: 250
fixed: 300
modalBackdrop: 400
modal: 500
```

### Responsive Breakpoints
```
xs: 320px (small mobile)
sm: 640px (mobile)
md: 1024px (tablet)
lg: 1440px (desktop)
xl: 1920px (large desktop)
```

## API Integration Points

### Endpoints Required
- `POST /api/auth/register` - User registration (NEW - must implement)
- `POST /api/auth/login` - Login (existing)
- `GET /api/songs` - All songs (existing)
- `GET /api/playlists` - User playlists (existing)
- `POST /api/playlists` - Create playlist (existing)
- `GET /api/playlists/{id}` - Playlist detail (existing)
- `POST /api/playlists/{id}/songs/{songId}` - Add song (existing)
- `DELETE /api/playlists/{id}/songs/{songId}` - Remove song (existing)

### Admin Endpoints (Ready to implement)
- `POST /api/songs` - Upload song (admin only)
- `DELETE /api/songs/{id}` - Delete song (admin only)
- `PUT /api/songs/{id}` - Edit song details (admin only)

## Role-Based Access Implementation

### Extract Role from JWT
```typescript
// In AuthContext or utils
const user = parseJwt(token); // Returns { id, email, role }

// Check role
if (user?.role === 'ADMIN') {
  // Show admin features
}
```

### Sidebar Conditional Rendering
```typescript
// Conditionally add admin menu items
...(user?.role === 'ADMIN' ? [
  { id: 'upload', label: 'Add Song', ... },
  { id: 'manage', label: 'Manage Songs', ... },
] : [])
```

### Component-Level Access
```typescript
<SongCard
  song={song}
  isAdmin={user?.role === 'ADMIN'}
  onDelete={isAdmin ? handleDelete : undefined}
/>
```

## Performance Optimizations

1. **Image Lazy Loading**
   - `loading="lazy"` on cover images
   - Fallback gradient backgrounds

2. **CSS-in-JS Prevention**
   - All styles in `.css` files
   - Design tokens in TypeScript (imported when needed)

3. **Code Splitting**
   - Vite automatically chunks pages
   - Route-based lazy loading ready

4. **Bundle Size**
   - 294 KB JS (95 KB gzipped)
   - 26 KB CSS (5 KB gzipped)
   - No external UI frameworks

## Testing Verification

### Build Verification
```bash
npm run build
# Expected: No errors, size < 300KB
```

### Desktop Testing (1440px+)
- [ ] All sidebar items visible
- [ ] Song grid displays 4+ columns
- [ ] Playlists sidebar sticky
- [ ] No overflow or wrapping issues

### Tablet Testing (1024px)
- [ ] Sidebar width adjusted (200px)
- [ ] Grid displays 3 columns
- [ ] Playlist layout single column
- [ ] Touch targets >= 44px

### Mobile Testing (768px)
- [ ] Sidebar horizontal or hidden
- [ ] Grid displays 2 columns
- [ ] Full-width inputs
- [ ] Easy thumb access

### Small Mobile Testing (480px)
- [ ] Grid displays 2 columns max
- [ ] All content readable
- [ ] No horizontal scroll
- [ ] Touch targets >= 48px

## Deployment Checklist

### Frontend Deployment
- [ ] Run `npm run build`
- [ ] Test build locally with `npm run preview`
- [ ] Deploy `dist/` folder
- [ ] Verify environment variables
- [ ] Test all routes load
- [ ] Check console for errors

### Backend Deployment
- [ ] Implement `/api/auth/register` endpoint
- [ ] Verify JWT contains `role` field
- [ ] Test role-based access
- [ ] Implement admin song endpoints
- [ ] Test with curl or Postman

### Post-Deployment Testing
- [ ] User registration flow
- [ ] Login and JWT validation
- [ ] Role-based menu items
- [ ] Song playback (ensure audio URLs correct)
- [ ] Playlist creation and management
- [ ] Responsive design on all devices
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing on actual devices

## Notes for Backend Developers

### Registration Endpoint
```
POST /api/auth/register
Request Body:
{
  "email": "user@example.com",
  "password": "securePassword",
  "confirmPassword": "securePassword"
}

Response:
{
  "token": "eyJhbGc...",
  "tokenType": "Bearer"
}
```

### JWT Format Expected
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "role": "USER" | "ADMIN",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Admin Endpoints Needed
1. Create Song (POST /api/songs)
2. Update Song (PUT /api/songs/{id})
3. Delete Song (DELETE /api/songs/{id})
4. List Uploads (GET /api/admin/songs)

