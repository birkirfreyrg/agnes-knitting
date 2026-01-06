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
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Til baka</span>
          </button>
        </div>
      </div>
      {/* Content */}
      <article className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-5 text-sm text-gray-500 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Main Content - Markdown */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <div className="my-10">
                  <img
                    {...props}
                    alt={props.alt || 'Post image'}
                    className="w-full mx-auto object-contain rounded-lg"
                    style={{ maxHeight: '500px', height: 'auto' }}
                  />
                </div>
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed mb-5 text-base" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 first:mt-0" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 mb-5 text-gray-700 space-y-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-600 hover:text-blue-700 underline" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-6" {...props} />
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
              <Tag className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors"
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
