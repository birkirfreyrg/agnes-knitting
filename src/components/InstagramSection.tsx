import { Instagram, Heart, MessageCircle } from 'lucide-react';
import type { InstagramPost } from '@/lib/instagram';
export function InstagramSection({ posts }: { posts: InstagramPost[] }) {
  return (
    <section id="instagram" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Instagram className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-semibold text-gray-800">@agnesknitting</h2>
        </div>
        {posts.length > 0 && <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">Fylgstu með því sem er á prjónunum, nýjustu flíkunum og litunum sem verða fyrir valinu.</p>}
        
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fylgstu með á Instagram
            </h3>
            <p className="text-gray-600 max-w-md mb-4">
              Prjónaverkefni og innblástur frá @agnesknitting.
            </p>
            <a 
              href="https://instagram.com/agnesknitting" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-shadow"
            >
              <Instagram className="w-5 h-5" />
              <span>Vertu með á Instagram</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
              >
                <img 
                  src={post.image} 
                  alt={`Instagram post ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        
        {posts.length > 0 && <div className="text-center mt-8">
          <a 
            href="https://instagram.com/agnesknitting" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-shadow"
          >
            <Instagram className="w-5 h-5" />
            <span>Vertu með á Instagram</span>
          </a>
        </div>}
      </div>
    </section>
  );
}
