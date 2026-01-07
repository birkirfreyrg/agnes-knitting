import { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { Post } from '../data/mockPosts';

interface PostsSectionProps {
  posts?: Post[];
  onPostClick: (post: Post) => void;
  status?: "idle" | "loading" | "ready" | "error";
}

const POSTS_PER_PAGE = 3;

export function PostsSection({ posts = [], onPostClick, status = "ready" }: PostsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort posts by date (most recent first) and paginate
  const { totalPages, paginatedPosts } = useMemo(() => {
    // Use provided posts
    const displayPosts = posts && posts.length > 0 ? posts : [];

    // Sort by date (most recent first)
    const sorted = [...displayPosts].sort((a, b) => {
      const dateA = a.dateValue?.getTime() ?? 0;
      const dateB = b.dateValue?.getTime() ?? 0;
      return dateB - dateA;
    });

    // Calculate pagination
    const total = Math.ceil(sorted.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      totalPages: total,
      paginatedPosts: paginated,
    };
  }, [posts, currentPage]);

  const handlePageChange = (page: number) => {
  setCurrentPage(page);

  const postsSection = document.getElementById('posts');
  const header = document.querySelector('header'); // or '#site-header'

  if (!postsSection) return;

  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  const top =
    postsSection.getBoundingClientRect().top + window.scrollY - headerHeight - 12; // extra padding

  window.scrollTo({ top, behavior: 'smooth' });
};


  return (
    <section id="posts" className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Færslur</h2>
        
        {/* Loading State */}
        {status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ekki tókst að sækja færslur
            </h3>
            <p className="text-gray-600 max-w-md">
              Því miður gátum við ekki sótt færslurnar í augnablikinu. Vinsamlegast reyndu aftur síðar.
            </p>
          </div>
        )}

        {/* Empty State */}
        {status === "ready" && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Engar færslur fundust
            </h3>
            <p className="text-gray-600 max-w-md">
              Engar færslur eru tiltækar í augnablikinu. Komdu aftur síðar til að sjá nýjar færslur.
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {status === "ready" && paginatedPosts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPosts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => onPostClick(post)}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    currentPage === page
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
