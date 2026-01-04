import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { PostsSection } from "./components/PostsSection";
import { InstagramSection } from "./components/InstagramSection";
import { RecommendedSection } from "./components/RecommendedSection";
import { PostDetail } from "./components/PostDetail";
import type { Post } from "./data/mockPosts";
import { normalizeStrapiPosts } from "./utils/strapiNormalizer";
import { mockPosts } from "./data/mockPosts";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export default function App() {
  const [payload, setPayload] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Check URL for post slug on mount and when posts load
  useEffect(() => {
    const path = window.location.pathname;
    const slugMatch = path.match(/^\/post\/(.+)$/);
    
    if (slugMatch && posts.length > 0) {
      const slug = slugMatch[1];
      const post = posts.find(p => p.slug === slug);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [posts]);

  const apiUrl = useMemo(() => {
    // populate=* is fine for local dev; later you may want to be explicit for performance
    return `${STRAPI_URL}/api/posts?populate=*`;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();

        if (cancelled) return;

        console.log("STRAPI RESPONSE:", json);

        setPayload(json);
        const normalizedPosts = normalizeStrapiPosts(json);
        setPosts(normalizedPosts.length > 0 ? normalizedPosts : mockPosts);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError((e as Error)?.message || String(e));
        setStatus("error");
        // If Strapi fails, posts will remain empty and mock data will be used
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  // If a post is selected, show the post detail view
  if (selectedPost) {
    return (
      <>
        <PostDetail 
          post={selectedPost} 
          onClose={() => {
            setSelectedPost(null);
            window.history.pushState({}, '', '/');
          }} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PostsSection posts={posts} onPostClick={setSelectedPost} />
        <InstagramSection />
        <RecommendedSection />
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Agnes Knitting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
