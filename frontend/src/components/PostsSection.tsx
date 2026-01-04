import { Calendar, Clock } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Colorful Yarn Collection for Spring Projects",
    excerpt: "Discover the most vibrant and soft yarn collections perfect for your spring knitting projects. From pastel shades to bold hues, find inspiration for your next creation.",
    image: "https://images.unsplash.com/photo-1706864685950-c7db14f24290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMHlhcm4lMjBjcmFmdHxlbnwxfHx8fDE3NjcxODU3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "December 28, 2025",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Beginner's Guide to Cable Knitting",
    excerpt: "Learn the art of cable knitting with this comprehensive guide. We'll walk you through the basics and show you how to create beautiful textured patterns that will elevate your projects.",
    image: "https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG5lZWRsZXMlMjB3b29sfGVufDF8fHx8MTc2NzExOTIxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "December 25, 2025",
    readTime: "8 min read"
  }
];

export function PostsSection() {
  return (
    <section id="posts" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Recent Posts</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {mockPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
      </div>
    </section>
  );
}

