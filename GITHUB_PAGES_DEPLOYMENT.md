# GitHub Pages Deployment Guide for agnesknitting.is

This guide will help you deploy your frontend to GitHub Pages with your custom domain `agnesknitting.is`.

## Prerequisites

- A GitHub account
- Your repository pushed to GitHub
- Access to your domain's DNS settings (agnesknitting.is)

## Step 1: Prepare Your Repository

1. Make sure your code is pushed to GitHub
2. Ensure your default branch is `main` (or `master` - if it's `master`, update line 6 in `.github/workflows/deploy.yml` to say `branches: - master`)
3. Make sure you're in the root of your repository (not in the `frontend` folder)

## Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. This will use the workflow file we created (`.github/workflows/deploy.yml`)

## Step 3: Set Up Environment Variables (Secrets)

Since GitHub Pages builds are public, you need to store sensitive values as GitHub Secrets:

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

   - **Name**: `VITE_STRAPI_URL`
     **Value**: Your Strapi Cloud URL (e.g., `https://your-project.strapiapp.com`)
   
   - **Name**: `VITE_INSTAGRAM_ACCESS_TOKEN` (Optional)
     **Value**: Your Instagram access token
   
   - **Name**: `VITE_INSTAGRAM_USER_ID` (Optional)
     **Value**: Your Instagram user ID

## Step 4: Configure Your Custom Domain DNS

You need to configure DNS records for `agnesknitting.is` to point to GitHub Pages:

### Option A: Using Apex Domain (agnesknitting.is)

Add these DNS records in your domain registrar:

**Type**: `A`  
**Name**: `@` (or leave blank)  
**Value**: 
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Option B: Using CNAME (www.agnesknitting.is)

If you prefer using `www.agnesknitting.is`:

**Type**: `CNAME`  
**Name**: `www`  
**Value**: `your-username.github.io` (replace with your GitHub username)

**Note**: The CNAME file in `frontend/public/CNAME` is already set to `agnesknitting.is`. If you want to use `www.agnesknitting.is`, update it.

## Step 5: Enable Custom Domain in GitHub

1. After your first deployment succeeds, go to **Settings** → **Pages**
2. Under **Custom domain**, enter: `agnesknitting.is`
3. Check **Enforce HTTPS** (this may take a few minutes to become available)

## Step 6: Verify DNS Configuration

After setting up DNS, verify it's working:

1. Wait 24-48 hours for DNS propagation (usually faster, but can take time)
2. Check DNS propagation: https://www.whatsmydns.net/#A/agnesknitting.is
3. Test your domain: https://agnesknitting.is

## Step 7: Deploy

1. Push your code to the `main` branch (or trigger the workflow manually)
2. Go to **Actions** tab in your GitHub repository
3. Watch the workflow run - it will:
   - Install dependencies
   - Build your frontend
   - Deploy to GitHub Pages

## Troubleshooting

### Build Fails

- Check the **Actions** tab for error messages
- Verify all environment variables (secrets) are set correctly
- Make sure your `package.json` scripts are correct

### Domain Not Working

- Verify DNS records are correct (use `dig agnesknitting.is` or online DNS checkers)
- Wait for DNS propagation (can take up to 48 hours)
- Check GitHub Pages settings - custom domain should be listed
- Ensure HTTPS is enabled in GitHub Pages settings

### 404 Errors on Routes

- This is handled by the `404.html` file we created
- GitHub Pages will serve `index.html` for all routes, which allows React Router to work

### Images/Assets Not Loading

- Check that asset paths are correct (should be relative paths)
- Verify the `base` in `vite.config.js` is set to `/`

## Updating Your Site

Every time you push to the `main` branch, the site will automatically rebuild and deploy. You can also manually trigger deployments from the **Actions** tab.

## Local Testing

Before deploying, test your production build locally:

```bash
cd frontend
npm run build
npm run preview
```

This will show you exactly how the site will look on GitHub Pages.

## Important Notes

- **Environment Variables**: All `VITE_*` variables must be set as GitHub Secrets
- **CNAME File**: The `CNAME` file in `frontend/public/` will be copied to the root of your site
- **HTTPS**: GitHub Pages automatically provides SSL certificates for custom domains
- **Build Time**: Each deployment takes about 2-5 minutes

## Support

If you encounter issues:
1. Check GitHub Actions logs for build errors
2. Verify DNS configuration with your domain registrar
3. Check GitHub Pages settings for any warnings
4. Ensure all secrets are correctly set

