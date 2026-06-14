# Backend Network Connection Error - Diagnosis Guide

## Current Configuration

Your frontend is configured to connect to:
- **Local Dev:** `http://localhost:5000/api` (from `.env`)
- **Fallback:** `https://backend-gamma-eight-14.vercel.app/api` (from api.js)

## Why Network Connection is Failing

### Reason 1: Backend Server Not Running ⚠️ (Most Common)

**Check if backend is running:**
```bash
# Try to ping the backend
curl http://localhost:5000/api/health

# Or from PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api" -ErrorAction SilentlyContinue
```

**Expected response:** 
- Either a 200 status code or 404 (means server is running)
- If connection refused → **Backend is NOT running**

**Solution:**
1. Navigate to your backend folder
2. Run: `npm run dev` or `npm start`
3. Wait for it to start on port 5000
4. Try frontend again

---

### Reason 2: Wrong Port Configuration

**Verify what port your backend is actually running on:**

1. Check backend startup message:
   ```
   Server running on http://localhost:3000   // ← If you see 3000, not 5000
   ```

2. If backend is on different port, update `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api   # Change 5000 to actual port
   ```

3. Restart frontend dev server: `npm run dev`

---

### Reason 3: CORS Issues (Even if Backend is Running)

**Symptoms:**
- Backend shows request received
- Browser shows network error
- Console has CORS errors

**Solution - Backend needs to enable CORS:**

```javascript
// In backend (Express/Node example)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true
}));
```

**Or if using Vercel backend:**
- Make sure Vercel backend has CORS enabled
- Check backend `.env` or configuration

---

### Reason 4: Frontend .env Not Loaded

**Check if environment variable is actually being used:**

1. Open browser DevTools (F12)
2. Go to Console and paste:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

3. If it shows `undefined`:
   - Delete `.env` and recreate it
   - Restart dev server: `npm run dev`

4. If it shows correct URL but still failing:
   - Check if backend is running on that port
   - Check CORS settings
   - Check firewall settings

---

### Reason 5: Firewall Blocking Connection

**Windows Firewall might be blocking Node.js:**

1. Open **Windows Defender Firewall → Advanced Settings**
2. Click **Inbound Rules** → **New Rule**
3. Select **Program** → **Next**
4. Browse to: `C:\Program Files\nodejs\node.exe`
5. Click **Next** → Select **Allow**
6. Finish and restart backend

---

## Step-by-Step Diagnostic

### Step 1: Check Backend is Running

**PowerShell:**
```powershell
# Test connection to backend
Test-NetConnection -ComputerName localhost -Port 5000

# Should show:
# TcpTestSucceeded : True   ← Means backend is running
# TcpTestSucceeded : False  ← Means backend is NOT running
```

### Step 2: Check Correct Port

**PowerShell:**
```powershell
# Find what's running on port 5000
netstat -ano | findstr :5000

# Shows process ID if something is using it
```

### Step 3: Test Backend Directly

**From PowerShell:**
```powershell
curl http://localhost:5000/api/auth/me
# or
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me"
```

### Step 4: Check Frontend Environment Variable

**In browser console:**
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
```

### Step 5: Check Browser Network Tab

1. Open DevTools → **Network** tab
2. Make a login/request attempt
3. Look for failed requests
4. Click on the failed request to see:
   - **Status:** What error code?
   - **Type:** `xhr` or `fetch`?
   - **Response:** What error message?

---

## Quick Fixes Checklist

| Issue | Fix |
|-------|-----|
| Backend not running | `npm run dev` in backend folder |
| Wrong port | Update `VITE_API_URL` in `.env` to correct port |
| CORS blocked | Add CORS to backend middleware |
| .env not loaded | Restart dev server after creating/editing `.env` |
| Firewall blocking | Allow Node.js through Windows Firewall |
| Old build cached | Clear `dist/` folder and rebuild |

---

## Most Likely Scenario for You

Based on your setup, most likely cause:

1. **Backend is not running** → Start it with `npm run dev`
2. **Backend running on wrong port** → Check actual port and update `.env`
3. **CORS not enabled** → Add CORS middleware to backend

---

## Test Everything Works

Once you fix the issue, test with:

```javascript
// In browser console
fetch('http://localhost:5000/api/auth/me')
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err))
```

Should either show:
- ✅ User data (if you're logged in)
- ✅ 401 error (if not logged in - but connection works!)
- ❌ Connection failed (backend not running)

---

## Still Can't Connect?

Provide these details and I can help further:

1. **Backend folder location:**
   ```bash
   # Run this in backend folder
   pwd  # or cd (in PowerShell)
   ```

2. **Backend start command:**
   - What command do you run to start backend?
   - What port does it show?

3. **Error message from browser console:**
   - Copy exact error text
   - Include Network tab details

4. **Backend logs:**
   - Paste last 10 lines of backend console output

