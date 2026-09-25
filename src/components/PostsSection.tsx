import Link from 'next/link'
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import type { DisplayPost } from '@/lib/content'
export function PostsSection({ posts, page, totalPages }: { posts: DisplayPost[]; page: number; totalPages: number }) {
  return <section id="posts" className="py-12 bg-white"><div className="container mx-auto px-4 max-w-7xl">
    <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Af prjónunum</h2>
    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8 leading-relaxed">Velkomin í prjónahornið mitt. Hér deili ég verkefnum, garnvali og litum, frá handlituðum peysum og gulu sumarprjóni að vettlingum úr afgangagarni.</p>
    {!posts.length && <div className="flex flex-col items-center py-16 text-center"><AlertCircle className="w-16 h-16 text-gray-400 mb-4"/><h3 className="text-xl font-semibold mb-2">Nýjar færslur væntanlegar</h3><p className="text-gray-600">Hér mun ég deila prjónaverkefnum og innblæstri.</p></div>}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{posts.map((post) => <article key={post.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
      <Link href={`/post/${encodeURIComponent(post.slug)}`} className="block h-full">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">{post.image && <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>}</div>
        <div className="p-5"><h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3><p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/>{post.date}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/>{post.readTime}</span></div>
        </div>
      </Link>
    </article>)}</div>
    {totalPages > 1 && <nav aria-label="Síður með færslum" className="flex items-center justify-center gap-4 mt-10">
      {page > 1 && <Link href={`/?page=${page - 1}#posts`} aria-label="Fyrri síða" className="p-2 border border-gray-300 rounded-md"><ChevronLeft className="w-4 h-4"/></Link>}
      <span className="text-sm text-gray-600">{page} / {totalPages}</span>
      {page < totalPages && <Link href={`/?page=${page + 1}#posts`} aria-label="Næsta síða" className="p-2 border border-gray-300 rounded-md"><ChevronRight className="w-4 h-4"/></Link>}
    </nav>}
  </div></section>
}
