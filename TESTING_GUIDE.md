# Quick Start Guide - Testing Registration Flow

## Prerequisites

Make sure you have:
- ✅ Java 17+ installed
- ✅ Maven installed (or use `./mvnw`)
- ✅ Node.js 18+ installed
- ✅ PostgreSQL running with music_streaming database
- ✅ Backend JWT secrets configured in `application.yml`

---

## Step 1: Start Backend Server

```bash
# Navigate to backend
cd backend/music-streaming-backend

# Build and run
./mvnw spring-boot:run

# Expected output:
# Started MusicStreamingBackendApplication
# Listening on port 8080
```

**Verify backend is running**:
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

---

## Step 2: Start Frontend Development Server

```bash
# In new terminal, navigate to frontend
cd frontend/music-streaming-frontend

# Install dependencies (if first time)
npm install

# Start dev server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

---

## Step 3: Test Registration

### Test 1: Successful Registration

1. **Click "Sign Up"** link on login page (or go to `/register`)
2. **Enter details**:
   - Email: `alice@example.com`
   - Password: `SecurePass123`
   - Confirm: `SecurePass123`
3. **Click "Create Account"**
4. **Expected**:
   - ✅ Success message appears for 2 seconds
   - ✅ Auto-redirects to login page
   - ✅ No errors in browser console

### Test 2: Duplicate Email Error

1. **Go to** `/register`
2. **Enter same email**: `alice@example.com`
3. **Enter password**: `SecurePass456`
4. **Expected**:
   - ✅ Error message: "Email is already registered"
   - ✅ Page stays on registration form
   - ✅ User not logged in

### Test 3: Password Mismatch

1. **Go to** `/register`
2. **Email**: `bob@example.com`
3. **Password**: `Pass1234`
4. **Confirm**: `Pass5678` (different)
5. **Expected**:
   - ✅ Client-side validation: "Passwords do not match"
   - ✅ NO request sent to server

### Test 4: Login with New Account

1. **Go to** `/login`
2. **Enter**: `alice@example.com` / `SecurePass123`
3. **Click "Sign In"**
4. **Expected**:
   - ✅ User logged in successfully
   - ✅ Redirected to home page (`/`)
   - ✅ Sidebar shows email and role ("👤 User")
   - ✅ Can see "Listen Now", "Browse", "My Playlists", "Library" menu

### Test 5: User Role Verification

After login as regular user:

1. **Sidebar should show**:
   - ✅ ♫ Listen Now
   - ✅ ◉ Browse
   - ✅ 𝄞 My Playlists
   - ✅ ⚁ Library
   - ❌ ⬆ Add Song (NOT VISIBLE)
   - ❌ ⚙ Manage Songs (NOT VISIBLE)

2. **To see admin items**, you would need an admin account

---

## Step 4: Test Admin Role (Optional)

If you want to test admin features:

### Option A: Create Admin via Database

```sql
-- Connect to PostgreSQL
psql -U postgres -d music_streaming -W

-- Create admin user directly
INSERT INTO users (id, email, encoded_password, role, created_at)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'admin@example.com',
  '$2a$10$...(bcrypt hash of 'AdminPass123')...',
  'ADMIN',
  NOW()
);
```

To generate bcrypt hash, use online tool or CLI:
```bash
# Install bcrypt-cli
npm install -g bcryptjs

# Generate hash
echo "AdminPass123" | bcryptjs hash -
# Copy the hash and paste in INSERT query
```

### Option B: Create via Backend (if you have endpoint)

Once admin user exists:

1. **Go to** `/login`
2. **Login as admin**: `admin@example.com` / `AdminPass123`
3. **Sidebar should show**:
   - ✅ ♫ Listen Now
   - ✅ ◉ Browse
   - ✅ 𝄞 My Playlists
   - ✅ ⚁ Library
   - ✅ ⬆ Add Song (NOW VISIBLE)
   - ✅ ⚙ Manage Songs (NOW VISIBLE)

---

## Step 5: Test Error Cases

### Invalid Email Format

1. **Go to** `/register`
2. **Enter**: `not-an-email`
3. **Expected**: Client-side validation prevents submission
4. **Message**: "Please enter a valid email address"

### Password Too Short

1. **Go to** `/register`
2. **Password**: `short`
3. **Expected**: Client-side validation prevents submission
4. **Message**: "Password must be at least 6 characters"

### Missing Fields

1. **Go to** `/register`
2. **Leave fields empty**
3. **Click "Create Account"**
4. **Expected**: Client-side validation prevents submission

---

## Browser Console Check

After each test, check browser console (F12 → Console tab):

- ✅ **No error messages** in red
- ✅ **Auth API calls** visible in Network tab
- ✅ **Token properly stored** in localStorage
  - Key: `music_app_token`
  - Value: JWT token starting with `eyJ...`

---

## Troubleshooting

### Backend Not Starting

**Error**: "Connection refused"

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check backend port 8080 is free
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Check database exists
psql -U postgres -l | grep music_streaming
```

### Frontend Shows 404

**Error**: "Cannot GET /register"

```bash
# Frontend not running properly, restart it
npm run dev

# Verify listening on localhost:5173
curl http://localhost:5173/
```

### Registration Fails with 500 Error

**Error**: "Unexpected server error" after submit

1. **Check backend logs** for actual error
2. **Check database connections**
3. **Verify JWT configuration** in `application.yml`

### JWT Token Not Storing

**Check**: Local storage in browser

```javascript
// In browser console
localStorage.getItem('music_app_token')
// Should return JWT token (starts with "eyJ")

// If null, registration didn't complete successfully
// Check browser Network tab for failed requests
```

---

## API Testing with cURL

### Register New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "charlie@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'

# Success (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}

# Error - duplicate email:
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Email is already registered",
  "path": "/api/auth/register"
}

# Error - mismatched passwords:
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Passwords do not match",
  "path": "/api/auth/register"
}
```

### Verify JWT Token

```bash
# Get a JWT token first (from registration or login)
TOKEN="eyJhbGc..."

# Use token in request
curl -X GET http://localhost:8080/api/songs \
  -H "Authorization: Bearer ${TOKEN}"

# Should return list of songs if token is valid
```

---

## Test Accounts Created

After running through tests, you should have these accounts:

| Email | Password | Role | Created By |
|-------|----------|------|-----------|
| alice@example.com | SecurePass123 | USER | Registration Test 1 |
| bob@example.com | Pass1234 | USER | (not created due to mismatch) |
| admin@example.com | AdminPass123 | ADMIN | Manual database setup (optional) |

---

## Performance Baseline

After all builds complete, check sizes:

```
Frontend Build Output:
- dist/index.html:                  0.47 kB (gzip: 0.30 kB)
- dist/assets/index-*.css          26.52 kB (gzip: 5.36 kB)
- dist/assets/index-*.js          295.14 kB (gzip: 95.47 kB)

Backend Build Output:
- target/music-streaming-backend-0.0.1-SNAPSHOT.jar
  File size: ~50-60 MB
```

These are good baseline metrics for future performance tuning.

---

## Git Commit Message

If committing these changes:

```
feat: Implement user registration and role-based auth

- Add /api/auth/register endpoint with email uniqueness validation
- Implement password confirmation and error handling
- Add register method to AuthService with proper validation
- Update frontend authAPI with register function
- Add register support to AuthContext
- Enhance error message extraction for better UX
- Fix pom.xml lombok annotation processor version
- Default new users to USER role, conditional admin UI rendering
- Full JWT integration with role inclusion

Fixes:
- User registration now works end-to-end
- Admin controls hidden from non-admin users
- Meaningful error messages shown to users
- Password confirmation validation enforced
- Email uniqueness guaranteed

Tests:
- Registration successful with valid data
- Duplicate email prevented with 400 error
- Password mismatch validation works
- Admin role conditionally shows UI items
- JWT token contains role claim
```

---

## Next Steps (After Verification)

1. ✅ **Test registration** - Follow above checklist
2. ✅ **Test login** - Login with newly created account
3. ✅ **Test admin UI** - Verify admin menu items appear/hide
4. ✅ **Test error cases** - Verify all error messages
5. 🔄 **Create admin pages** - Build /admin/upload and /admin/manage pages (optional)
6. 🔄 **Test playlist creation** - Verify playlist CRUD works
7. 🔄 **Load testing** - Test with multiple concurrent users if needed
8. 📦 **Deployment** - Deploy to production

---

## Support

For issues during testing:

1. Check logs in backend console output
2. Check browser console (F12) for JavaScript errors
3. Check Network tab in browser DevTools for API failures
4. Verify database connectivity
5. Check environment configuration

