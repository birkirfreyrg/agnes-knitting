import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { PostsSection } from "./components/PostsSection";
import { InstagramSection } from "./components/InstagramSection";
import { RecommendedSection } from "./components/RecommendedSection";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

function normalizePosts(payload) {
  // Strapi v4 typically: { data: [ { id, attributes: {...} } ] }
  // Strapi v5 often:      { data: [ { id or documentId, ...fields } ] } (no attributes)
  // Some setups may return: { data: {...} } for single types, etc.

  const raw = payload?.data;

  if (!raw) return [];

  const arr = Array.isArray(raw) ? raw : [raw];

  return arr.map((item) => {
    const attrs = item?.attributes ?? item ?? {};

    const id = item?.id ?? item?.documentId ?? attrs?.id ?? crypto.randomUUID();

    // Try common field names
    const title = attrs.title ?? attrs.name ?? "";
    const excerpt = attrs.excerpt ?? attrs.summary ?? attrs.description ?? "";
    const content = attrs.content ?? "";

    // Handle common cover image shapes (populate needed)
    const coverRel =
      attrs.coverImage?.data ??
      attrs.cover?.data ??
      attrs.image?.data ??
      attrs.coverImage ??
      attrs.cover ??
      attrs.image ??
      null;

    const coverUrl =
      coverRel?.attributes?.url ??
      coverRel?.url ??
      null;

    const fullCoverUrl =
      coverUrl && coverUrl.startsWith("http")
        ? coverUrl
        : coverUrl
          ? `${STRAPI_URL}${coverUrl}`
          : null;

    return {
      id,
      title,
      excerpt,
      content,
      fullCoverUrl,
      raw: item,
    };
  });
}

export default function App() {
  const [payload, setPayload] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");

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
        setPosts(normalizePosts(json));
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || String(e));
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PostsSection />
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
