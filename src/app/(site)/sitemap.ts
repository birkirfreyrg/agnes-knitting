import type { MetadataRoute } from 'next'
import { cms } from '@/lib/content'
import { siteURL } from '@/lib/site'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await cms()
  const posts = await payload.find({ collection: 'posts', overrideAccess: false, where: { _status: { equals: 'published' } }, pagination: false, depth: 0, select: { slug: true, updatedAt: true } })
  return [{ url: siteURL }, ...posts.docs.map((post) => ({ url: `${siteURL}/post/${encodeURIComponent(post.slug)}`, lastModified: post.updatedAt }))]
}
