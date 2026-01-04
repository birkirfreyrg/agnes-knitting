import { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '../data/mockPosts';
import { mockPosts } from '../data/mockPosts';

interface PostsSectionProps {
  posts?: Post[];
  onPostClick: (post: Post) => void;
}

const POSTS_PER_PAGE = 2;

export function PostsSection({ posts = mockPosts, onPostClick }: PostsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort posts by date (most recent first) and paginate
  const { totalPages, paginatedPosts } = useMemo(() => {
    // Use provided posts or fallback to mock data
    const displayPosts = posts && posts.length > 0 ? posts : mockPosts;

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
    <section id="posts" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Færslur</h2>
        
        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {paginatedPosts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => onPostClick(post)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
