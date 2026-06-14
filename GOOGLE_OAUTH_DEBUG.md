# Google OAuth 401 invalid_client Error - Debugging Guide

## Quick Fix Checklist

### 1. ✅ Verify Environment Variable is Loaded
Check your browser's Network tab when you click Google login:
- Open DevTools (F12)
- Go to Console tab and type: `console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)`
- You should see your Client ID printed. If it shows `undefined` or empty, the .env file isn't being loaded.

**Solution:** 
- Make sure `.env` file exists in project root (same level as package.json)
- Restart your dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Del)

### 2. ✅ Verify Client ID Format
Your Client ID should look like: `XXXXXX-XXXXXXXXXXXX.apps.googleusercontent.com`

If it's wrong or says `YOUR_GOOGLE_CLIENT_ID_HERE`, you need to:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to Credentials
4. Copy the correct OAuth 2.0 Client ID
5. Update it in `.env` file

### 3. ✅ Check Google Cloud Console Configuration

Go to [Google Cloud Console](https://console.cloud.google.com) → Credentials → Click on your OAuth 2.0 Client:

#### Authorized JavaScript Origins MUST include:
- `http://localhost:3000` (if running on port 3000)
- `http://localhost:5173` (if running on port 5173 - default Vite)
- `http://localhost:5174` (if running on port 5174)
- Your production domain

**To fix:**
1. Click Edit on your OAuth 2.0 Client
2. Add the URL where your app is running
3. Click Save

**How to find your dev server URL:**
```bash
# When you run: npm run dev
# You'll see output like:
# VITE v5.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5173/
#              ↑↑↑ THIS IS YOUR URL
```

#### Authorized Redirect URIs MUST include:
- `http://localhost:3000` (if applicable)
- `http://localhost:5173`
- Your production domain

### 4. ✅ Verify Backend is Receiving Correct Client ID

The backend also needs to know the same Client ID for token verification.

**Backend should have:**
```bash
# In your backend .env
GOOGLE_CLIENT_ID=904273605358-rm2ou1oh7k1mtsbepjqsps7grsnkqnsa.apps.googleusercontent.com
```

**Backend code should verify with this ID:**
```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID  // ← Must match
  });
  return ticket.getPayload();
}
```

### 5. ✅ Check Token Format

When Google sends the token, it should be a valid JWT. The error "invalid_client" typically means:
- **Frontend:** Wrong Client ID passed to GoogleOAuthProvider
- **Backend:** Client ID doesn't match what Google Console has registered

### 6. ✅ Test Step by Step

**Step 1:** Check environment variable
```javascript
// In browser console
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
```

**Step 2:** Check if GoogleOAuthProvider is initialized
```javascript
// Try this in browser console
console.log(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
// Should show React is running
```

**Step 3:** Check Network requests
- Open DevTools → Network tab
- Click Google login button
- Look for requests to `accounts.google.com` or `oauth2.googleapis.com`
- Check the response for error details

## Common Causes of 401 invalid_client

| Error | Cause | Fix |
|-------|-------|-----|
| Client ID undefined | .env file not loaded | Restart dev server |
| Wrong Client ID | Copy-paste error | Verify in Google Console |
| Origin not registered | Dev server URL not in Console | Add URL to Console |
| Backend Client ID mismatch | Different IDs on frontend/backend | Use same Client ID everywhere |
| Expired credentials | Credentials revoked/reset | Create new credentials |

## Step-by-Step Fix Process

1. **Verify .env file exists:**
   ```bash
   dir c:\Users\ManikantaRedrouthu\frontend\.env
   ```

2. **Check .env contains correct Client ID:**
   ```bash
   type c:\Users\ManikantaRedrouthu\frontend\.env
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Test in browser console:**
   ```javascript
   console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
   ```

5. **If still failing, verify Google Console:**
   - Go to https://console.cloud.google.com
   - Check OAuth 2.0 Credentials
   - Verify authorized origins match your dev server URL
   - Click on the credential to see all settings

## Debug Mode

Add this to your GoogleLoginButton.jsx temporarily to see detailed errors:

```javascript
const handleGoogleError = (error) => {
  console.error('Google Login Error:', error);
  console.error('Error Details:', JSON.stringify(error, null, 2));
  toast.error(`Google login failed: ${error?.error || 'Unknown error'}`);
};
```

Then check browser console for the full error message.

## Still Having Issues?

Try these additional steps:

1. **Clear everything and restart:**
   ```bash
   # Kill dev server (Ctrl+C)
   # Delete node_modules
   rm -r node_modules
   # Reinstall
   npm install
   # Start fresh
   npm run dev
   ```

2. **Create new Google OAuth credentials:**
   - Go to Google Cloud Console
   - Delete old credential
   - Create new OAuth 2.0 Client ID
   - Add proper origins
   - Update .env

3. **Check browser storage:**
   - Open DevTools → Application
   - Check if `VITE_GOOGLE_CLIENT_ID` appears in any cache

4. **Verify CORS is not the issue:**
   - Check Network tab → all requests complete successfully
   - Backend should have CORS enabled

## Expected Flow

✅ User clicks Google button  
✅ Google consent screen appears  
✅ Browser sends token to backend  
✅ Backend verifies token with Google  
✅ Backend creates/logs in user  
✅ User redirected to dashboard  

If you're stuck at any step, the error message will help identify which part is failing.

