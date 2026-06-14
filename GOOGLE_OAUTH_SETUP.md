# Google OAuth Integration Guide

This document explains how to set up Google OAuth login for your HostelHub application.

## Frontend Setup (Completed)

The frontend is now configured to support Google login on both Login and Register pages. Here's what was added:

### Components & Services
- **GoogleLoginButton.jsx** - Reusable Google login button component
- **googleAuthService.js** - Service for Google authentication endpoints
- Updated **authService.js** - Added `googleLogin()` and `googleRegister()` methods
- Updated **AuthContext.jsx** - Added `googleLogin()` and `googleRegister()` methods
- Updated **main.jsx** - Wrapped app with `GoogleOAuthProvider`

### UI Changes
- Login page now displays Google login option below the email/password form
- Register page now displays Google login option below the registration form
- Both pages show "OR" divider to separate traditional and Google login

## Backend Setup Required

### 1. Install Dependencies
```bash
npm install jsonwebtoken  # If not already installed
```

### 2. Add Google OAuth Endpoints

Create these two new endpoints in your backend:

#### POST `/auth/google-login`
```javascript
// Request body: { token: "Google ID token" }
// Response: { token: "JWT token", user: { id, name, email, mobile, role } }

// Steps:
// 1. Verify the Google ID token using google-auth-library
// 2. Extract user info (email, name) from token
// 3. Check if user exists in database
// 4. If exists, return JWT token with user data
// 5. If not exists, return error asking to register
```

#### POST `/auth/google-register`
```javascript
// Request body: { token: "Google ID token" }
// Response: { token: "JWT token", user: { id, name, email, mobile, role } }

// Steps:
// 1. Verify the Google ID token
// 2. Extract user info (email, name) from token
// 3. Check if user with this email already exists
// 4. If exists, return error "Email already registered"
// 5. If not exists, create new user with:
//    - email from token
//    - name from token
//    - mobile: empty or ask user to provide (optional for OAuth signup)
//    - password: randomly generated (user won't use it)
//    - role: 'user' by default
// 6. Return JWT token with new user data
```

### 3. Install Google Auth Library

```bash
npm install google-auth-library  # or @google-auth-library/core
```

### 4. Backend Implementation Example

```javascript
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Verify Google Token
async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (err) {
    throw new Error('Invalid Google token');
  }
}

// Login Route
router.post('/auth/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
    
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res.status(404).json({ 
        message: 'Please register first using Google' 
      });
    }
    
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token: jwtToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// Register Route
router.post('/auth/google-register', async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
    
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Email already registered' 
      });
    }
    
    const newUser = new User({
      name: payload.name,
      email: payload.email,
      mobile: '', // Optional for OAuth signup
      password: generateRandomPassword(), // Won't be used
      role: 'user'
    });
    
    await newUser.save();
    
    const jwtToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token: jwtToken,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          role: newUser.role
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

## Google Cloud Console Setup

### 1. Create a Project
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Click on the project dropdown and select "New Project"
- Name your project (e.g., "HostelHub")
- Click "Create"

### 2. Enable OAuth 2.0
- In the sidebar, navigate to "APIs & Services" → "OAuth consent screen"
- Select "External" for User Type
- Fill in the required app information
- Add scopes (select "openid", "profile", "email")

### 3. Create Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Select "Web application"
- Add Authorized JavaScript origins:
  - `http://localhost:3000` (development)
  - `http://localhost:5173` (Vite development)
  - Your production domain
- Add Authorized redirect URIs:
  - `http://localhost:3000` (development)
  - `http://localhost:5173` (Vite development)
  - Your production domain
- Copy the Client ID

### 4. Configure Environment Variables

**Frontend (.env)**
```
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_FROM_GOOGLE_CONSOLE
```

**Backend (.env)**
```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_FROM_GOOGLE_CONSOLE
```

## Testing Google Login

1. Start your backend server
2. Start your frontend dev server
3. Navigate to `/login` or `/register`
4. Click the Google login button
5. Sign in with a Google account
6. You should be redirected to the dashboard/home page

## Key Features

✅ **One-Click Login** - Users can sign in with just Google credentials  
✅ **Auto-fill Details** - Name and email are automatically populated from Google  
✅ **Automatic Registration** - First-time users are automatically registered  
✅ **Seamless Integration** - Works alongside existing email/password auth  
✅ **User-Friendly** - Reduces signup friction with pre-filled information  

## Security Considerations

- Always verify Google tokens on the backend
- Use HTTPS in production
- Store Google Client ID securely in environment variables
- Implement rate limiting on auth endpoints
- Validate token expiration
- Use secure JWT signing with strong secrets

## Troubleshooting

**"Google login button not appearing"**
- Check that `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Verify GoogleOAuthProvider is wrapping the app in main.jsx

**"Invalid Google token error"**
- Ensure Google Client ID matches between frontend and backend
- Check that the token hasn't expired
- Verify backend is using correct Google Client ID

**"User already exists error"**
- This means the email is already registered with traditional signup
- User should use email/password login instead

**"CORS errors"**
- Add your frontend URL to Google Console authorized origins
- Ensure backend has CORS enabled

