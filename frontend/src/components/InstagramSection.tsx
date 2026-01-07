import { useEffect, useState } from 'react';
import { Instagram, Heart, MessageCircle, AlertCircle } from 'lucide-react';
import { fetchInstagramPosts } from '../services/instagramService';

interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  comments: number;
  permalink: string;
}

export function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      setError(null);
      
      try {
        const instagramPosts = await fetchInstagramPosts();
        
        if (instagramPosts.length > 0) {
          setPosts(instagramPosts);
        } else {
          setError('Ekki tókst að sækja Instagram færslur');
          setPosts([]);
        }
      } catch (err) {
        console.error('Error loading Instagram posts:', err);
        setError('Ekki tókst að sækja Instagram færslur');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <section id="instagram" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Instagram className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-semibold text-gray-800">@agnesknitting</h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ekki tókst að sækja Instagram færslur
            </h3>
            <p className="text-gray-600 max-w-md mb-4">
              Því miður gátum við ekki sótt Instagram færslurnar í augnablikinu.
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
        
        <div className="text-center mt-8">
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
      </div>
    </section>
  );
}
