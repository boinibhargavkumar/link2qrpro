# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "localhost refused to connect" or "ERR_CONNECTION_REFUSED"

**Symptoms:**
- Browser shows "This site can't be reached"
- Error: ERR_CONNECTION_REFUSED
- Port 8080 or 5173 not accessible

**Solutions:**

#### Solution A: Wrong Port Configuration
The VS Code launch configuration was pointing to port 8080, but Vite runs on 5173.

**Fix:**
- Updated `.vscode/launch.json` to use port 5173
- Don't use the VS Code debugger launcher
- Instead, run manually:

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`

#### Solution B: Development Server Not Running
You need to start the dev server first.

**Steps:**
1. Open terminal in project folder
2. Run: `npm install` (first time only)
3. Run: `npm run dev`
4. Browser should auto-open, or go to `http://localhost:5173`

#### Solution C: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Fix:**
- Option 1: Kill the process using the port
  ```bash
  # Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5173 | xargs kill
  ```

- Option 2: Use a different port
  Add to `vite.config.js`:
  ```javascript
  server: {
    port: 3000  // or any other available port
  }
  ```

### Issue 2: Import Errors or "Cannot find module"

**Symptoms:**
```
Error: Cannot find module '@base44/sdk'
Error: Cannot find module '@base44/vite-plugin'
```

**Fix:**
This means the base44 references weren't completely removed. 

**Solution:**
1. Make sure you're using the updated `vite.config.js` (without base44 imports)
2. Delete `node_modules` folder
3. Run `npm install` again
4. Run `npm run dev`

### Issue 3: White Screen or Blank Page

**Symptoms:**
- Page loads but shows nothing
- Console shows errors

**Checks:**
1. Open browser console (F12)
2. Look for errors
3. Common causes:
   - Missing imports
   - Syntax errors
   - Base44 references not removed

**Fix:**
Check the console error and:
- If it mentions `base44`, those files need to be updated
- If it's an import error, check the file paths
- Try clearing browser cache (Ctrl+Shift+Delete)

### Issue 4: Logo Upload Not Working

**Symptoms:**
- Logo upload button doesn't work
- Error when selecting image

**Fix:**
The independent version uses base64 encoding instead of cloud upload. This should work automatically, but if it doesn't:

1. Check browser console for errors
2. Verify the file is an image (jpg, png, gif, etc.)
3. Verify file is under 5MB
4. Try a different image

### Issue 5: Environment Variables Not Found

**Symptoms:**
```
Error: import.meta.env.VITE_BASE44_APP_ID is undefined
```

**Fix:**
The independent version doesn't need these. If you see this error:

1. Check `src/lib/app-params.js` - it should not reference base44 env vars
2. Make sure you're using the updated version from the zip
3. The file should return default values, not read env variables

## Step-by-Step Setup Guide

### First Time Setup

1. **Extract the ZIP file**
   ```bash
   unzip Link2QRpro-Independent.zip
   cd Link2QRpro-Independent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   Wait for installation to complete (may take 1-2 minutes)

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v6.x.x ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

4. **Open in Browser**
   - Browser should auto-open
   - Or manually go to `http://localhost:5173`

5. **Test the Website**
   - Go to "Master QR" page
   - Add some URLs
   - Generate QR codes
   - Upload a logo (optional)
   - Download QR codes

### Running the Project

**Every time you want to work on it:**

```bash
cd Link2QRpro-Independent
npm run dev
```

**To stop the server:**
Press `Ctrl + C` in the terminal

### Building for Production

When ready to deploy:

```bash
npm run build
```

This creates a `dist` folder with your production files.

### Deploying

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
1. Drag the `dist` folder to https://app.netlify.com/drop
2. Done!

**Option 3: GitHub Pages**
1. Push code to GitHub
2. In repository settings → Pages
3. Deploy from `dist` folder

## VS Code Specific Issues

### Issue: "Launch Chrome against localhost" doesn't work

**Why:**
VS Code's debugger launcher tries to open the browser before the dev server is ready.

**Solution:**
Don't use the VS Code launcher. Instead:

1. Open terminal in VS Code (Ctrl + `)
2. Run: `npm run dev`
3. Server will start and open browser automatically

### Issue: Terminal shows "command not found: npm"

**Why:**
Node.js is not installed or not in PATH.

**Solution:**
1. Download and install Node.js from https://nodejs.org/
2. Restart VS Code
3. Try again

## Checking Your Installation

Run these commands to verify everything is set up:

```bash
# Check Node.js version (should be 16+ or 18+)
node --version

# Check npm version
npm --version

# Check if dependencies are installed
ls node_modules

# Should show many folders if installed correctly
```

## Still Having Issues?

### 1. Check the Browser Console
- Press F12 in browser
- Look at Console tab
- Read the error messages

### 2. Check the Terminal
- Look for error messages
- Look for "EADDRINUSE" (port in use)
- Look for "module not found" (missing dependencies)

### 3. Start Fresh
Sometimes the easiest solution:

```bash
# Delete node_modules
rm -rf node_modules

# Delete package-lock.json
rm package-lock.json

# Install fresh
npm install

# Run dev server
npm run dev
```

### 4. Verify You're Using the Independent Version
Check these files to ensure base44 is removed:

**vite.config.js should NOT have:**
```javascript
import base44 from "@base44/vite-plugin"  // ❌ Should not exist
```

**package.json should NOT have:**
```json
"@base44/sdk": "^0.8.3",  // ❌ Should not exist
```

If you see these, you might be using the old version. Extract the zip again.

## Need More Help?

1. Check the console error message
2. Search the error on Google/Stack Overflow
3. Check if port 5173 is available
4. Try a different port in `vite.config.js`
5. Make sure all base44 references are removed

## Success Checklist

- [ ] Node.js installed (v16+)
- [ ] npm install completed without errors
- [ ] npm run dev starts without errors
- [ ] Browser opens to localhost:5173
- [ ] No console errors (F12)
- [ ] Can navigate to Master QR page
- [ ] Can generate QR codes
- [ ] Can upload logo
- [ ] Can download QR codes

If all checked ✅, you're good to go!

---

**Last Updated:** February 2026
**For:** Link2QRpro Independent Version
