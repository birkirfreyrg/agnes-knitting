import type { MetadataRoute } from 'next'
import { siteURL } from '@/lib/site'
export default function robots(): MetadataRoute.Robots {
  return process.env.VERCEL_ENV === 'preview' ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/preview'] }, sitemap: `${siteURL}/sitemap.xml` }
}
