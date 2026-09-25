import type { Endpoint } from 'payload'

// Editors can research their own connected feed without exposing the API token.
export const instagramEditorEndpoint: Endpoint = {
  path: '/instagram-posts',
  method: 'get',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    const user = process.env.INSTAGRAM_USER_ID
    if (!token || !user) return Response.json({ error: 'Instagram is not configured' }, { status: 503 })
    const url = new URL(`https://graph.instagram.com/${encodeURIComponent(user)}/media`)
    url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp')
    url.searchParams.set('limit', '40')
    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(15000) })
      if (!response.ok) return Response.json({ error: 'Instagram request failed' }, { status: 502 })
      const { data } = await response.json()
      // Never forward paging URLs, which can contain credentials.
      return Response.json({ data: Array.isArray(data) ? data : [] }, { headers: { 'Cache-Control': 'private, no-store' } })
    } catch {
      return Response.json({ error: 'Instagram request failed' }, { status: 502 })
    }
  },
}
