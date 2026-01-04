import { useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Post } from '../data/mockPosts';

interface PostDetailProps {
  post: Post;
  onClose: () => void;
}

export function PostDetail({ post, onClose }: PostDetailProps) {
  // Update URL when post opens
  useEffect(() => {
  const newUrl = `/post/${post.slug}`;

  if (window.location.pathname !== newUrl) {
    window.history.pushState({ postId: post.id }, '', newUrl);
  } else {
    // ensure state exists even if URL already matches
    window.history.replaceState({ postId: post.id }, '', newUrl);
  }

  const handlePopState = (event: PopStateEvent) => {
    if (!event.state || !event.state.postId) onClose();
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, [post.slug, post.id, onClose]);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="sticky top-0 bg-white shadow-sm z-40 border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Til baka</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden bg-gray-200">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Main Content - Markdown */}
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:text-gray-600 prose-blockquote:border-l-blue-500 prose-code:text-gray-800 prose-pre:bg-gray-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <div className="my-8">
                  <img
                    {...props}
                    alt={props.alt || 'Post image'}
                    className="w-full max-w-3xl mx-auto object-contain"
                    style={{ maxHeight: '600px', height: 'auto' }}
                  />
                </div>
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
