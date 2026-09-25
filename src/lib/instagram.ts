import 'server-only'
export interface InstagramPost { id: string; image: string; permalink: string; likes: number; comments: number }
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const user = process.env.INSTAGRAM_USER_ID
  if (!token || !user) return []
  try {
    const url = new URL(`https://graph.instagram.com/${encodeURIComponent(user)}/media`)
    url.searchParams.set('fields', 'id,media_url,media_type,permalink,like_count,comments_count')
    url.searchParams.set('limit', '8')
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) })
    if (!response.ok) return []
    const { data } = await response.json()
    if (!Array.isArray(data)) return []
    return data.filter((item) => ['IMAGE', 'CAROUSEL_ALBUM'].includes(item.media_type)).map((item) => ({ id: item.id, image: item.media_url, permalink: item.permalink, likes: item.like_count || 0, comments: item.comments_count || 0 }))
  } catch { return [] }
}
