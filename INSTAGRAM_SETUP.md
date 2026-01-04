# Instagram Integration Setup Guide

This guide will help you set up Instagram integration to fetch real posts from your Instagram account.

## Step 1: Create Environment File

1. **Create a `.env` file** in the `frontend` directory (if it doesn't exist)
2. **Add your Instagram credentials:**

```env
VITE_INSTAGRAM_ACCESS_TOKEN=your_access_token_here
VITE_INSTAGRAM_USER_ID=your_instagram_user_id_here
```

## Step 2: Get Instagram Access Token

Since you mentioned you have an API key from Meta Developer App, you'll need:

### Option A: Using Instagram Graph API (Recommended for Business/Creator Accounts)

1. **Go to Meta for Developers**: https://developers.facebook.com/
2. **Create or select your App**
3. **Add Instagram Basic Display or Instagram Graph API** product
4. **Get Access Token:**
   - Go to Tools → Graph API Explorer
   - Select your app
   - Generate User Token with permissions: `instagram_basic`, `pages_show_list`, `instagram_graph_user_profile`, `instagram_graph_user_media`
   - Copy the Access Token

5. **Get Your Instagram Business Account ID:**
   - In Graph API Explorer, query: `me/accounts`
   - This returns your Facebook Pages
   - For each page, query: `{page-id}?fields=instagram_business_account`
   - This gives you the Instagram Business Account ID (this is your USER_ID)

### Option B: Using Instagram Basic Display API (For Personal Accounts)

1. **Set up Instagram Basic Display** in Meta for Developers
2. **Create Instagram App** with Basic Display product
3. **Get User Token** through OAuth flow
4. **The User ID** can be extracted from the token or from the API response

## Step 3: Alternative - Using Username (Limited)

If you're using Instagram Basic Display API, you can use your username `birkirfreyr95`, but you'll still need:
- Access Token (from OAuth flow)
- User ID (can be retrieved from the token)

**Note:** The current implementation expects a User ID (numeric ID, not username). Instagram Graph API requires the Instagram Business Account ID, not the username.

## Step 4: Update .env File

Once you have your Access Token and User ID, add them to `frontend/.env`:

```env
VITE_INSTAGRAM_ACCESS_TOKEN=your_long_access_token_here
VITE_INSTAGRAM_USER_ID=17841405309217663
```

**Important Notes:**
- `.env` files are already in `.gitignore`, so your credentials won't be committed
- Access Tokens typically expire after 60 days (short-lived) or can be long-lived
- For production, you may need to set up token refresh

## Step 5: Test the Integration

1. **Start your dev server:** `npm run dev`
2. **Check the browser console** for any errors
3. **If the API call fails**, the component will fall back to mock data

## Troubleshooting

### Error: "Invalid Access Token"
- Make sure your token hasn't expired
- Regenerate the token in Meta for Developers
- Ensure you have the correct permissions

### Error: "Invalid User ID"
- Make sure you're using the Instagram Business Account ID (numeric), not username
- For Business accounts, get the ID from: `{page-id}?fields=instagram_business_account`
- For Basic Display, use the user ID from the token

### No Posts Showing
- Check that your account has public posts (or the token has permission to access posts)
- Verify the User ID is correct
- Check browser console for API errors

## Security Best Practices

✅ **DO:**
- Keep `.env` file in `.gitignore` (already done)
- Never commit `.env` files to Git
- Use environment variables in production (via hosting platform settings)
- Rotate tokens regularly

❌ **DON'T:**
- Commit `.env` files
- Share tokens publicly
- Hardcode tokens in source code
- Expose tokens in client-side code (Note: Vite env vars are exposed to client - use backend proxy for production)

## Production Considerations

For production, consider:
1. **Backend Proxy**: Create an API endpoint in your backend that fetches Instagram posts
   - This keeps the access token secure on the server
   - Client requests your backend, backend requests Instagram
   
2. **Token Refresh**: Set up automatic token refresh since Instagram tokens expire

3. **Caching**: Cache Instagram posts to reduce API calls and improve performance

