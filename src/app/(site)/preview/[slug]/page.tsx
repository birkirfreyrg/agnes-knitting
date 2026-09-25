import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { cms, displayPost } from '@/lib/content'
import { PostDetail } from '@/components/PostDetail'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Forskoðun', robots: { index: false, follow: false } }
export default async function Preview({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await cms()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')
  const { slug } = await params
  const result = await payload.find({ collection: 'posts', user, overrideAccess: false, draft: true, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  if (!result.docs[0]) notFound()
  return <><div className="bg-amber-100 px-4 py-3 text-center">Forskoðun: aðeins sýnilegt innskráðum ritstjórum</div><PostDetail post={displayPost(result.docs[0])}/></>
}
