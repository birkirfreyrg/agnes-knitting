import { getStrapiUrl } from './strapiConfig';

export interface Recommendation {
  id: number;
  type: 'Vörumerki' | 'Búð' | 'Vara';
  name: string;
  description: string;
  image: string;
  link: string;
}

/**
 * Normalizes Strapi recommendation data to match the Recommendation interface
 * Handles both Strapi v4 and v5 response formats
 */
export function normalizeStrapiRecommendations(payload: any): Recommendation[] {
  const raw = payload?.data;

  if (!raw) return [];

  const arr = Array.isArray(raw) ? raw : [raw];

  return arr.map((item): Recommendation => {
    const attrs = item?.attributes ?? item ?? {};

    const id = item?.id ?? item?.documentId ?? attrs?.id ?? crypto.randomUUID();

    // Basic fields
    const name = attrs.name ?? attrs.title ?? "";
    const description = attrs.description ?? attrs.excerpt ?? "";

    // Type field - should be 'Vörumerki', 'Búð', or 'Vara'
    const typeRaw = attrs.type ?? "Vara";
    const type = (typeRaw === 'Vörumerki' || typeRaw === 'Búð' || typeRaw === 'Vara') 
      ? typeRaw 
      : 'Vara';

    // Handle image - Strapi v4/v5 format
    const imageRel =
      attrs.image?.data ??
      attrs.coverImage?.data ??
      attrs.cover?.data ??
      attrs.image ??
      attrs.coverImage ??
      attrs.cover ??
      null;

    const imageUrl =
      imageRel?.attributes?.url ??
      imageRel?.url ??
      null;

    // Handle image URLs - Strapi Cloud may return full URLs or relative paths
    const strapiUrl = getStrapiUrl();
    let fullImageUrl = "";
    if (imageUrl) {
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        // Already a full URL (Strapi Cloud)
        fullImageUrl = imageUrl;
      } else if (imageUrl.startsWith("/")) {
        // Relative path - prepend Strapi URL
        fullImageUrl = `${strapiUrl}${imageUrl}`;
      } else {
        // Path without leading slash
        fullImageUrl = `${strapiUrl}/${imageUrl}`;
      }
    }

    // Link field
    const link = attrs.link ?? attrs.url ?? "#";

    return {
      id: typeof id === 'number' ? id : parseInt(String(id), 10) || 0,
      type,
      name,
      description,
      image: fullImageUrl,
      link,
    };
  });
}

