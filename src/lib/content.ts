import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Post, Recommendation } from '@/payload-types'
export const cms = () => getPayload({ config })
export const POSTS_PER_PAGE = 3
export function mediaURL(media: number | Media | null | undefined) { return media && typeof media === 'object' ? media.url || '' : '' }
export function displayPost(post: Post) {
  return { ...post, image: mediaURL(post.coverImage), date: new Date(post.date).toLocaleDateString('is-IS', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }), tags: post.tags?.map(({ tag }) => tag) || [] }
}
export type DisplayPost = ReturnType<typeof displayPost>
export function displayRecommendation(item: Recommendation) { return { ...item, image: mediaURL(item.image) } }
export type DisplayRecommendation = ReturnType<typeof displayRecommendation>
export const getPost = cache(async (slug: string) => {
  const payload = await cms()
  const result = await payload.find({ collection: 'posts', overrideAccess: false, draft: false, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, depth: 1, limit: 1 })
  return result.docs[0] || null
})
