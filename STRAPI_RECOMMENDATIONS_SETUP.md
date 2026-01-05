# Strapi Recommendations Setup Guide

This guide will help you set up the "Recommendation" content type in Strapi to replace the mock data in the Recommended section.

## Step 1: Create the Recommendation Content Type

1. **Go to Strapi Admin Panel** → **Content-Type Builder**
2. **Click "Create new collection type"**
3. **Name it:** `recommendation` (singular, lowercase)
4. **Click "Continue"**

## Step 2: Add Fields to the Recommendation Content Type

Add the following fields in this order:

### 1. **name** (Text field)
   - **Type:** Text
   - **Name:** `name`
   - **Required:** ✅ Yes
   - **Settings:** 
     - **Type:** Short text
     - **Default value:** (leave empty)

### 2. **description** (Text field)
   - **Type:** Text
   - **Name:** `description`
   - **Required:** ✅ Yes
   - **Settings:**
     - **Type:** Long text
     - **Default value:** (leave empty)

### 3. **type** (Enumeration field)
   - **Type:** Enumeration
   - **Name:** `type`
   - **Required:** ✅ Yes
   - **Values:** 
     ```
     brand
     store
     item
     ```
   - **Default value:** `item`
   - **Note:** Enter each value on a new line (brand, store, item)

### 4. **image** (Media field)
   - **Type:** Media
   - **Name:** `image`
   - **Required:** ✅ Yes
   - **Settings:**
     - **Allowed types:** Images only
     - **Multiple media:** ❌ No (single image)

### 5. **link** (Text field)
   - **Type:** Text
   - **Name:** `link`
   - **Required:** ✅ Yes
   - **Settings:**
     - **Type:** Short text
     - **Default value:** (leave empty)
   - **Note:** This should be a full URL (e.g., `https://example.com`)

## Step 3: Save the Content Type

1. **Click "Save"** at the top right
2. Strapi will restart automatically

## Step 4: Set API Permissions

1. **Go to Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. **Find "Recommendation"** in the list
3. **Check the box for "find"** (to allow public access to read recommendations)
4. **Click "Save"**

## Step 5: Create Your First Recommendations

1. **Go to Content Manager** → **Recommendation**
2. **Click "Create new entry"**
3. **Fill in the fields:**
   - **name:** e.g., "Wool & The Gang"
   - **description:** e.g., "Premium sustainable yarn and knitting kits for modern makers"
   - **type:** Select from dropdown (brand, store, or item)
   - **image:** Click to upload an image
   - **link:** e.g., "https://woolandthegang.com"
4. **Click "Save"** then **"Publish"**
5. **Repeat** for each recommendation you want to add

## Field Summary

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `name` | Text (Short) | ✅ Yes | The name of the brand, store, or item |
| `description` | Text (Long) | ✅ Yes | A description of the recommendation |
| `type` | Enumeration | ✅ Yes | One of: `brand`, `store`, or `item` |
| `image` | Media | ✅ Yes | An image to display |
| `link` | Text (Short) | ✅ Yes | URL to learn more (full URL with https://) |

## API Endpoint

Once set up, your recommendations will be available at:
```
GET http://localhost:1337/api/recommendations?populate=*
```

The frontend will automatically fetch from this endpoint and display your recommendations.

## Notes

- **No rating field:** The rating field has been removed as requested
- **Type field:** Make sure to use exactly `brand`, `store`, or `item` (lowercase)
- **Image:** Upload high-quality images for best display results
- **Link:** Always use full URLs (starting with `http://` or `https://`)
- **Publishing:** Remember to click "Publish" after creating each entry, otherwise it won't appear in the API

## Troubleshooting

### Recommendations not showing?
- Check that entries are **Published** (not just saved as draft)
- Verify API permissions are set for Public role
- Check browser console for API errors
- Verify the Strapi URL in your `.env` file matches your Strapi instance

### Images not loading?
- Make sure images are uploaded and published
- Check that the `populate=*` parameter is in the API URL
- Verify image URLs in the API response

