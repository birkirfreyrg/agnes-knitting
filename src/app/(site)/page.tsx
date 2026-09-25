import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { PostsSection } from '@/components/PostsSection'
import { RecommendedSection } from '@/components/RecommendedSection'
import { InstagramSection } from '@/components/InstagramSection'
import { cms, displayPost, displayRecommendation, POSTS_PER_PAGE } from '@/lib/content'
import { getInstagramPosts } from '@/lib/instagram'
export const dynamic = 'force-dynamic'
export const metadata = { alternates: { canonical: '/' } }
export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: rawPage } = await searchParams
  const page = rawPage === undefined ? 1 : Number(rawPage)
  if (!Number.isSafeInteger(page) || page < 1) notFound()
  const payload = await cms()
  const [posts, recommendations, instagram] = await Promise.all([
    payload.find({ collection: 'posts', overrideAccess: false, draft: false, where: { _status: { equals: 'published' } }, sort: '-date', page, limit: POSTS_PER_PAGE, depth: 1 }),
    payload.find({ collection: 'recommendations', overrideAccess: false, draft: false, where: { _status: { equals: 'published' } }, sort: '-createdAt', pagination: false, depth: 1 }),
    getInstagramPosts(),
  ])
  if (page > Math.max(1, posts.totalPages)) notFound()
  return <><Header/><main><PostsSection posts={posts.docs.map(displayPost)} page={page} totalPages={posts.totalPages}/><InstagramSection posts={instagram}/><RecommendedSection recommendations={recommendations.docs.map(displayRecommendation)}/></main></>
}
