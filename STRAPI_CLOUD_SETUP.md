# Strapi Cloud Setup Guide

This guide will help you connect your frontend to your Strapi Cloud instance.

## Step 1: Get Your Strapi Cloud URL

1. Log in to your Strapi Cloud dashboard
2. Navigate to your project
3. Copy your project URL (it should look like: `https://your-project.strapi.app`)

## Step 2: Configure Environment Variables

1. In the `frontend` directory, create a `.env` file (if it doesn't exist)
2. Add your Strapi Cloud URL:

```env
VITE_STRAPI_URL=https://your-project.strapi.app
```

**Important:** 
- Replace `https://your-project.strapi.app` with your actual Strapi Cloud URL
- Do NOT include a trailing slash at the end of the URL
- The `.env` file is already in `.gitignore`, so it won't be committed to version control

## Step 3: Configure CORS in Strapi Cloud

You need to allow your frontend domain to access the Strapi API:

1. Go to your Strapi Cloud dashboard
2. Navigate to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Make sure the following permissions are enabled:
   - **Post**: `find` and `findOne`
   - **Recommendation**: `find` and `findOne`

4. For CORS configuration:
   - Go to **Settings** → **Configuration** → **Server**
   - In the CORS settings, add your frontend URL(s):
     - For local development: `http://localhost:5173` (or your Vite dev server port)
     - For production: Your production frontend URL (e.g., `https://yourdomain.com`)
   - You can also use `*` for development, but it's recommended to specify exact domains for production

## Step 4: Configure API Permissions

### Posts API
1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Under **Post**, enable:
   - `find` (to list posts)
   - `findOne` (to view individual posts)

### Recommendations API
1. In the same **Public** role settings
2. Under **Recommendation**, enable:
   - `find` (to list recommendations)
   - `findOne` (to view individual recommendations)

## Step 5: Test the Connection

1. Make sure your Strapi Cloud instance is running and accessible
2. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser and check the console for any errors
4. The frontend should now fetch data from your Strapi Cloud instance

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
- Make sure you've added your frontend URL to the CORS settings in Strapi Cloud
- Check that your `.env` file has the correct Strapi URL (without trailing slash)

### 401/403 Errors
If you get permission errors:
- Verify that the **Public** role has the correct permissions enabled
- Make sure your content types (Post, Recommendation) are published in Strapi

### Images Not Loading
- Strapi Cloud should return full URLs for images automatically
- If images are still not loading, check the browser console for the image URLs
- Make sure your media files are uploaded and published in Strapi

### Environment Variables Not Working
- Make sure your `.env` file is in the `frontend` directory
- Restart your Vite dev server after changing `.env` files
- Vite only exposes variables prefixed with `VITE_`

## Production Deployment

When deploying to production:

1. Set the `VITE_STRAPI_URL` environment variable in your hosting platform:
   - **Vercel**: Add it in Project Settings → Environment Variables
   - **Netlify**: Add it in Site Settings → Environment Variables
   - **Other platforms**: Follow their documentation for environment variables

2. Make sure to add your production frontend URL to Strapi Cloud CORS settings

3. Rebuild your frontend after setting the environment variable

## Example .env File

```env
# Strapi Cloud URL
VITE_STRAPI_URL=https://agnes-knitting.strapi.app

# Optional: Instagram API
# VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here
# VITE_INSTAGRAM_USER_ID=your_user_id_here
```

