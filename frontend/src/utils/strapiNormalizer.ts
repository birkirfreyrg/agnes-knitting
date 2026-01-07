import type { Post } from '../data/mockPosts';
import { getStrapiUrl } from './strapiConfig';

/**
 * Normalizes Strapi post data to match the Post interface
 * Handles both Strapi v4 and v5 response formats
 */
export function normalizeStrapiPosts(payload: any): Post[] {
  const raw = payload?.data;

  if (!raw) return [];

  const arr = Array.isArray(raw) ? raw : [raw];

  return arr.map((item): Post => {
    const attrs = item?.attributes ?? item ?? {};

    const id = item?.id ?? item?.documentId ?? attrs?.id ?? crypto.randomUUID();

    // Basic fields
    const title = attrs.title ?? attrs.name ?? "";
    const excerpt = attrs.excerpt ?? attrs.summary ?? attrs.description ?? "";

    // Handle cover image - Strapi v4/v5 format
    const coverRel =
      attrs.coverImage?.data ??
      attrs.cover?.data ??
      attrs.image?.data ??
      attrs.coverImage ??
      attrs.cover ??
      attrs.image ??
      null;

    const coverUrl =
      coverRel?.attributes?.url ??
      coverRel?.url ??
      null;

    // Handle image URLs - Strapi Cloud may return full URLs or relative paths
    const strapiUrl = getStrapiUrl();
    let fullCoverUrl = "";
    if (coverUrl) {
      if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
        // Already a full URL (Strapi Cloud)
        fullCoverUrl = coverUrl;
      } else if (coverUrl.startsWith("/")) {
        // Relative path - prepend Strapi URL
        fullCoverUrl = `${strapiUrl}${coverUrl}`;
      } else {
        // Path without leading slash
        fullCoverUrl = `${strapiUrl}/${coverUrl}`;
      }
    }

    // Handle date - format from ISO to readable format
    const dateValue = attrs.date ?? attrs.publishedAt ?? attrs.createdAt;
    const dateObj = dateValue ? new Date(dateValue) : new Date();
    const formattedDate = dateValue
      ? dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : "";

    // Read time
    const readTime = attrs.readTime ?? "5 min read";

    // Slug
    const slug = attrs.slug ?? "";

    // Handle content - Markdown string
    const content = attrs.content ?? "";

    // Handle tags - can be string (comma-separated) or array
    let tags: string[] = [];
    if (attrs.tags) {
      if (typeof attrs.tags === 'string') {
        tags = attrs.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      } else if (Array.isArray(attrs.tags)) {
        tags = attrs.tags.map((tag: any) => typeof tag === 'string' ? tag : String(tag));
      }
    }

    return {
      id: typeof id === 'number' ? id : parseInt(String(id), 10) || 0,
      title,
      slug,
      excerpt,
      image: fullCoverUrl,
      date: formattedDate,
      dateValue: dateObj,
      readTime,
      content,
      tags: tags.length > 0 ? tags : undefined,
    };
  });
}

