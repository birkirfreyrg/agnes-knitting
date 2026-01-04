# Strapi Setup Guide for Agnes Knitting Posts

This guide will help you set up Strapi to replace the temporary mock data with actual post data.

## Step 1: Create the "Post" Content Type

1. **Go to Strapi Admin Panel** → Content-Type Builder
2. **Click "Create new collection type"**
3. **Name it:** `Post` (singular, Strapi will pluralize it)
4. **Click "Continue"**

## Step 2: Add Fields to the Post Content Type

Add the following fields in this order:

### Basic Fields:

1. **Title** (Text - Short text)
   - Field name: `title`
   - Required: ✅ Yes

2. **Excerpt** (Text - Long text)
   - Field name: `excerpt`
   - Required: ✅ Yes

3. **Cover Image** (Media - Single media)
   - Field name: `coverImage`
   - Required: ✅ Yes
   - Allowed types: Images only

4. **Date** (Date - Date)
   - Field name: `date`
   - Required: ✅ Yes
   - Type: Date (not datetime)

5. **Read Time** (Text - Short text)
   - Field name: `readTime`
   - Required: ✅ Yes
   - Default value: "5 min read" (optional)

### Complex Content Field:

6. **Content** (JSON - JSON)
   - Field name: `content`
   - Required: ✅ Yes
   - This will store an array of content blocks

   **Structure for content field:**
   ```json
   [
     {
       "type": "text",
       "content": "Your paragraph text here..."
     },
     {
       "type": "image",
       "content": "https://example.com/image.jpg",
       "caption": "Optional image caption"
     },
     {
       "type": "video",
       "content": "https://www.youtube.com/embed/VIDEO_ID",
       "caption": "Optional video caption"
     }
   ]
   ```

## Step 3: Configure API Permissions

1. **Go to Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. **Find "Post"** in the permissions list
3. **Enable:**
   - ✅ `find` (to get all posts)
   - ✅ `findOne` (to get a single post)
4. **Click "Save"**

## Step 4: Create Sample Posts

1. **Go to Content Manager** → **Post**
2. **Click "Create new entry"**
3. **Fill in the fields:**
   - **Title:** "Colorful Yarn Collection for Spring Projects"
   - **Excerpt:** "Discover the most vibrant and soft yarn collections..."
   - **Cover Image:** Upload an image
   - **Date:** Select a date
   - **Read Time:** "5 min read"
   - **Content:** Paste this JSON:
   ```json
   [
     {
       "type": "text",
       "content": "Spring is the perfect time to refresh your knitting projects with vibrant, colorful yarns. As the days get longer and nature bursts into bloom, your knitting can reflect this beautiful transformation."
     },
     {
       "type": "image",
       "content": "https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda",
       "caption": "Beautiful yarn selection for spring projects"
     },
     {
       "type": "text",
       "content": "When selecting yarns for spring projects, consider both the color palette and the fiber content."
     }
   ]
   ```
4. **Click "Save"** then **"Publish"**

## Step 5: Update Your Frontend Code

The `normalizePosts` function in `App.tsx` needs to be updated to handle the Strapi response format. Here's what needs to change:

### Current Structure Expected:
- `id` - number
- `title` - string
- `excerpt` - string
- `image` - string (URL)
- `date` - string (formatted date)
- `readTime` - string
- `content` - array of PostContent objects

### Strapi Response Format:
Strapi v4/v5 typically returns:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "...",
        "excerpt": "...",
        "coverImage": {
          "data": {
            "attributes": {
              "url": "/uploads/image.jpg"
            }
          }
        },
        "date": "2025-12-28",
        "readTime": "5 min read",
        "content": [...]
      }
    }
  ]
}
```

## Step 6: API Endpoint

Your frontend is already configured to fetch from:
```
GET http://localhost:1337/api/posts?populate=*
```

Make sure to use `populate=*` to get all related data including images.

## Alternative: Using Components for Content (Advanced)

If you want a more structured approach, you can create a **Component** for content blocks:

1. **Content-Type Builder** → **Components**
2. **Create new component:** `Content Block`
3. **Add fields:**
   - `type` (Enumeration): text, image, video
   - `content` (Text - Long text)
   - `caption` (Text - Short text, optional)
4. **In Post Content Type:** Change `content` field to **Component** → **Repeatable** → Select `Content Block`

This approach is more user-friendly in the admin panel but requires updating the frontend normalization logic.

## Notes:

- **Date Formatting:** Strapi returns dates in ISO format. You may need to format them in the frontend.
- **Image URLs:** Make sure your Strapi server URL is correct in your `.env` file.
- **Content Structure:** The JSON field approach is simpler but less user-friendly. The Component approach is better for content editors.

