import { ExternalLink, AlertCircle } from 'lucide-react';
import type { DisplayRecommendation } from '@/lib/content';
export function RecommendedSection({ recommendations }: { recommendations: DisplayRecommendation[] }) {
  return (
    <section id="recommended" className="py-16 bg-gray-50 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Ég mæli með!</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Þetta eru uppáhalds vörumerkin mín, verslanir og hlutir sem ég treysti og nota reglulega í prjónaskapnum mínum.
        </p>
        
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Meðmæli væntanleg
            </h3>
            <p className="text-gray-600 max-w-md">
              Hér birtast bráðum uppáhalds vörumerkin mín, verslanir og vörur.
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
