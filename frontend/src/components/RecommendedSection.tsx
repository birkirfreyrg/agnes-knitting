import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Recommendation } from '../utils/recommendationNormalizer';

// Fallback mock data if API fails
const mockRecommendations: Recommendation[] = [
  {
    id: 1,
    type: 'Vörumerki',
    name: 'Wool & The Gang',
    description: 'Premium sustainable yarn and knitting kits for modern makers',
    image: 'https://images.unsplash.com/photo-1706864685950-c7db14f24290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMHlhcm4lMjBjcmFmdHxlbnwxfHx8fDE3NjcxODU3NTl8MA&ixlib=rb-4.1.0&q=80&w=400',
    link: '#'
  },
  {
    id: 2,
    type: 'Búð',
    name: 'The Yarn Shop',
    description: 'Local store with an amazing selection of luxury yarns and tools',
    image: 'https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG5lZWRsZXMlMjB3b29sfGVufDF8fHx8MTc2NzExOTIxOXww&ixlib=rb-4.1.0&q=80&w=400',
    link: '#'
  },
  {
    id: 3,
    type: 'Vara',
    name: 'ChiaoGoo Needles',
    description: 'The best circular knitting needles with smooth joins',
    image: 'https://images.unsplash.com/photo-1612208141706-2fbd2d45a143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGtuaXR0ZWQlMjBzd2VhdGVyfGVufDF8fHx8MTc2NzE4NTc2MHww&ixlib=rb-4.1.0&q=80&w=400',
    link: '#'
  }
];

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export function RecommendedSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      
      try {
        const response = await fetch(`${STRAPI_URL}/api/recommendations?populate=*`);
        
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        
        // Import the normalizer dynamically to avoid circular dependencies
        const { normalizeStrapiRecommendations } = await import('../utils/recommendationNormalizer');
        const normalized = normalizeStrapiRecommendations(json);
        
        if (normalized.length > 0) {
          setRecommendations(normalized);
        } else {
          // Fallback to mock data if no Strapi data
          setRecommendations(mockRecommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Fallback to mock data on error
        setRecommendations(mockRecommendations);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  const displayRecommendations = recommendations.length > 0 ? recommendations : mockRecommendations;

  return (
    <section id="recommended" className="py-16 bg-gray-50">
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
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {displayRecommendations.map((item) => (
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
