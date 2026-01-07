# Troubleshooting GitHub Pages Deployment

## Current Issue: 404 Error on agnesknitting.is

If you're seeing a 404 error even though GitHub Pages shows the site as "live", follow these steps:

### Step 1: Check GitHub Actions Workflow

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Look for the most recent "Deploy to GitHub Pages" workflow run
4. Click on it to see the details
5. Check if there are any errors (red X marks)

**Common Issues:**
- **Build failed**: Check the "Build" step for error messages
- **Missing secrets**: If build fails due to missing environment variables, add them in Settings → Secrets
- **Node version issues**: Should be using Node 20

### Step 2: Verify Build Output

The workflow now includes a verification step that checks:
- `index.html` exists in `dist/`
- `CNAME` file is present

If either is missing, the build will fail with an error message.

### Step 3: Check Deployment Status

1. Go to **Settings** → **Pages**
2. Check the "Last deployed" timestamp
3. If it's old, the workflow might not have run
4. Try manually triggering the workflow:
   - Go to **Actions** tab
   - Click "Deploy to GitHub Pages" workflow
   - Click "Run workflow" button
   - Select your branch (main) and run

### Step 4: Verify Files in Deployment

After a successful deployment, you should have:
- `index.html` in the root
- `CNAME` file with `agnesknitting.is`
- `404.html` for SPA routing
- `assets/` folder with JS/CSS files

### Step 5: Clear Browser Cache

Sometimes the browser caches the 404 page:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or open in incognito/private mode
3. Or clear browser cache completely

### Step 6: Check DNS Propagation

Even though DNS looks correct, there might be propagation issues:
1. Check: https://www.whatsmydns.net/#A/agnesknitting.is
2. All should show the GitHub Pages IPs (185.199.108.153, etc.)
3. If some show different IPs, wait for propagation (can take up to 48 hours)

### Step 7: Test GitHub Pages URL

Try accessing your site via the GitHub Pages URL:
- `https://birkirfreyrg.github.io/agnes-knitting/` (if using subpath)
- Or check what GitHub shows in Settings → Pages

If this works but your custom domain doesn't, it's a DNS issue.

### Step 8: Re-deploy

If nothing else works, try:
1. Make a small change to any file (add a space, comment, etc.)
2. Commit and push to trigger a new deployment
3. Wait for the workflow to complete
4. Check the site again

## Common Error Messages

### "index.html not found"
- The build didn't complete successfully
- Check the build logs in Actions tab
- Make sure `npm run build` works locally

### "CNAME not found"
- The workflow will try to copy it automatically
- If it still fails, manually ensure `frontend/public/CNAME` exists

### "Build failed: Cannot find module"
- Missing dependencies
- Run `npm install` in the frontend folder
- Make sure `package-lock.json` is committed

### "Environment variable not found"
- Add the missing secret in Settings → Secrets and variables → Actions
- Re-run the workflow after adding secrets

## Still Not Working?

If none of these steps help:
1. Check the GitHub Actions logs for specific error messages
2. Verify your repository structure matches what's expected
3. Make sure you're pushing to the correct branch (main/master)
4. Contact GitHub Support if the issue persists

