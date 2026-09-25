import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PostDetail } from '@/components/PostDetail'
import { getPost, displayPost, mediaURL } from '@/lib/content'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return { title: 'Síða fannst ekki' }
  const url = `/post/${encodeURIComponent(post.slug)}`
  return { title: post.title, description: post.excerpt, alternates: { canonical: url }, openGraph: { type: 'article', title: post.title, description: post.excerpt, url, images: mediaURL(post.coverImage) ? [mediaURL(post.coverImage)] : [] } }
}
export default async function Page({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  return <PostDetail post={displayPost(post)}/>
}
