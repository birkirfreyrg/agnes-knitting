import type { Metadata } from 'next'
import { siteURL } from '@/lib/site'
import './styles.css'
export const metadata: Metadata = {
  metadataBase: new URL(siteURL), title: { default: 'Agnes Knitting', template: '%s | Agnes Knitting' },
  description: 'Prjónaskapur, innblástur og uppáhalds vörurnar mínar.',
  robots: process.env.VERCEL_ENV === 'preview' ? { index: false, follow: false } : undefined,
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="is"><body>{children}<footer className="bg-gray-800 text-white py-8"><div className="container mx-auto px-4 text-center"><p>© {new Date().getFullYear()} Agnes Knitting. All rights reserved.</p></div></footer></body></html>
}
