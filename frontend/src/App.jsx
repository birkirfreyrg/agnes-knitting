import { useEffect, useMemo, useState } from "react";

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
    <div
      style={{
        maxWidth: 980,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 44 }}>
          My Knitting Journey <span aria-hidden>🧶</span>
        </h1>
        <p style={{ marginTop: 10, opacity: 0.8 }}>
          Powered by Strapi + React (Vite)
        </p>
      </header>

      <section
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 18,
          opacity: 0.8,
          fontSize: 14,
        }}
      >
        <strong>API:</strong>
        <code style={{ padding: "2px 6px", borderRadius: 6 }}>
          {apiUrl}
        </code>
      </section>

      {status === "loading" && <p>Loading posts…</p>}

      {status === "error" && (
        <div style={{ padding: 12, border: "1px solid #ffb3b3", borderRadius: 8 }}>
          <p style={{ margin: 0, color: "crimson" }}>
            <strong>Error:</strong> {error}
          </p>
          <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.85 }}>
            Check:
            {" "}
            1) Strapi is running at {STRAPI_URL},
            {" "}
            2) Public role has Post.find enabled,
            {" "}
            3) your posts are published,
            {" "}
            4) CORS is not blocking requests.
          </p>
        </div>
      )}

      {status === "ready" && posts.length === 0 && (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <p style={{ margin: 0 }}>
            No posts returned from Strapi.
          </p>
          <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.85 }}>
            If you have posts in the admin UI, make sure they’re <strong>published</strong> and
            Public permissions allow <code>find</code>.
          </p>
        </div>
      )}

      {status === "ready" && posts.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {posts.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                padding: 16,
                display: "grid",
                gridTemplateColumns: p.fullCoverUrl ? "160px 1fr" : "1fr",
                gap: 16,
                alignItems: "start",
              }}
            >
              {p.fullCoverUrl && (
                <img
                  src={p.fullCoverUrl}
                  alt={p.title || "Post cover"}
                  style={{
                    width: 160,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid #eee",
                  }}
                />
              )}

              <div>
                <h2 style={{ margin: 0, fontSize: 22 }}>
                  {p.title || "(Untitled post)"}
                </h2>

                {p.excerpt ? (
                  <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.85 }}>
                    {p.excerpt}
                  </p>
                ) : (
                  <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.6 }}>
                    (No excerpt field found — check your Strapi field name)
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Optional: quick debug view (remove later) */}
      {payload && (
        <details style={{ marginTop: 24 }}>
          <summary>Debug: raw API response</summary>
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 10,
              background: "#111",
              color: "#eee",
              overflowX: "auto",
              fontSize: 12,
            }}
          >
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
