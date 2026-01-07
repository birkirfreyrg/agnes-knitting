/**
 * Get the Strapi URL, ensuring it doesn't have a trailing slash
 * This prevents double slashes in API endpoints
 */
export function getStrapiUrl(): string {
  const url = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
  // Remove trailing slash if present
  return url.replace(/\/+$/, '');
}

