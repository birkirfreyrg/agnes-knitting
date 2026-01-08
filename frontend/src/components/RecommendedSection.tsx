import { useEffect, useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import type { Recommendation } from '../utils/recommendationNormalizer';
import { getStrapiUrl } from '../utils/strapiConfig';
import { fetchWithCache } from '../utils/strapiCache';

export function RecommendedSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      setError(null);
      
      try {
        const url = `${getStrapiUrl()}/api/recommendations?populate=*`;
        
        // Import the normalizer dynamically to avoid circular dependencies
        const { normalizeStrapiRecommendations } = await import('../utils/recommendationNormalizer');
        
        // Use cache-first strategy: get cached data immediately, then fetch fresh
        const { cached, fresh } = await fetchWithCache(
          url,
          'recommendations',
          normalizeStrapiRecommendations,
          5 * 60 * 1000 // 5 minutes cache TTL
        );

        // If we have cached data, show it immediately
        if (cached && cached.length > 0) {
          if (cancelled) return;
          setRecommendations(cached);
          setLoading(false);
          setError(null);
        } else {
          // No cache, show loading state
          if (cancelled) return;
          setLoading(true);
        }

        // Fetch fresh data in background (this will update cache and UI)
        try {
          const freshRecommendations = await fresh();

          if (cancelled) return;

          setRecommendations(freshRecommendations);
          setLoading(false);
          setError(null);
        } catch (fetchError) {
          // If fetch fails but we have cached data, keep showing it
          if (cancelled) return;
          if (cached && cached.length > 0) {
            // Keep showing cached data, but log the error
            console.warn("Failed to fetch fresh recommendations, using cached data:", fetchError);
            setLoading(false);
            setError(null);
          } else {
            // No cache and fetch failed - show error
            throw fetchError;
          }
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Error fetching recommendations:', error);
        setError('Ekki tókst að sækja ráðleggingar');
        setRecommendations([]);
        setLoading(false);
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="recommended" className="py-16 bg-gray-50 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Ég mæli með!</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Þetta eru uppáhalds vörumerkin mín, verslanir og hlutir sem ég treysti og nota reglulega í prjónaskapnum mínum.
        </p>
        
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-20" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ekki tókst að sækja ráðleggingar
            </h3>
            <p className="text-gray-600 max-w-md">
              Því miður gátum við ekki sótt ráðleggingarnar í augnablikinu. Vinsamlegast reyndu aftur síðar.
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Engar ráðleggingar fundust
            </h3>
            <p className="text-gray-600 max-w-md">
              Engar ráðleggingar eru tiltækar í augnablikinu. Komdu aftur síðar.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-3">
                    {item.type}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-end">
                    <a 
                      href={item.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="text-sm">Skoða</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
