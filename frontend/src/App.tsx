import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { PostsSection } from "./components/PostsSection";
import { InstagramSection } from "./components/InstagramSection";
import { RecommendedSection } from "./components/RecommendedSection";
import { PostDetail } from "./components/PostDetail";
import type { Post } from "./data/mockPosts";
import { normalizeStrapiPosts } from "./utils/strapiNormalizer";
import { getStrapiUrl } from "./utils/strapiConfig";
import { fetchWithCache } from "./utils/strapiCache";

export default function App() {
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
    return `${getStrapiUrl()}/api/posts?populate=*`;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");

      try {
        // Use cache-first strategy: get cached data immediately, then fetch fresh
        const { cached, fresh } = await fetchWithCache(
          apiUrl,
          'posts',
          normalizeStrapiPosts,
          5 * 60 * 1000 // 5 minutes cache TTL
        );

        // If we have cached data, show it immediately
        if (cached && cached.length > 0) {
          if (cancelled) return;
          setPosts(cached);
          setStatus("ready");
        } else {
          // No cache, show loading state
          if (cancelled) return;
          setStatus("loading");
        }

        // Fetch fresh data in background (this will update cache and UI)
        try {
          const freshPosts = await fresh();

          if (cancelled) return;

          console.log("STRAPI RESPONSE (fresh):", freshPosts);
          setPosts(freshPosts);
          setStatus("ready");
        } catch (fetchError) {
          // If fetch fails but we have cached data, keep showing it
          if (cancelled) return;
          if (cached && cached.length > 0) {
            // Keep showing cached data, but log the error
            console.warn("Failed to fetch fresh posts, using cached data:", fetchError);
            setStatus("ready");
          } else {
            // No cache and fetch failed - show error
            throw fetchError;
          }
        }
      } catch (e) {
        if (cancelled) return;
        setError((e as Error)?.message || String(e));
        setStatus("error");
        setPosts([]);
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
        <PostsSection posts={posts} onPostClick={setSelectedPost} status={status} />
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
