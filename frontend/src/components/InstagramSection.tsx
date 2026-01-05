import { useEffect, useState } from 'react';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import { fetchInstagramPosts } from '../services/instagramService';

interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  comments: number;
  permalink: string;
}

// Fallback mock data if API fails
const mockInstagramPosts: InstagramPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1706864685950-c7db14f24290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMHlhcm4lMjBjcmFmdHxlbnwxfHx8fDE3NjcxODU3NTl8MA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 234,
    comments: 12,
    permalink: "https://instagram.com/p/example1"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG5lZWRsZXMlMjB3b29sfGVufDF8fHx8MTc2NzExOTIxOXww&ixlib=rb-4.1.0&q=80&w=400",
    likes: 189,
    comments: 8,
    permalink: "https://instagram.com/p/example2"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1612208141706-2fbd2d45a143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGtuaXR0ZWQlMjBzd2VhdGVyfGVufDF8fHx8MTc2NzE4NTc2MHww&ixlib=rb-4.1.0&q=80&w=400",
    likes: 312,
    comments: 19,
    permalink: "https://instagram.com/p/example3"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1704652838411-4ddb18904aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBwaG9uZSUyMHNvY2lhbHxlbnwxfHx8fDE3NjcwOTA5MjN8MA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 145,
    comments: 6,
    permalink: "https://instagram.com/p/example4"
  }
];

export function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const instagramPosts = await fetchInstagramPosts();
      
      if (instagramPosts.length > 0) {
        setPosts(instagramPosts);
      } else {
        // Fallback to mock data if API fails or no token
        setPosts(mockInstagramPosts);
      }
      setLoading(false);
    }

    loadPosts();
  }, []);

  const displayPosts = posts.length > 0 ? posts : mockInstagramPosts;

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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayPosts.map((post) => (
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
