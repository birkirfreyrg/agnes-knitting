import { Star, ExternalLink } from 'lucide-react';

interface Recommendation {
  id: number;
  type: 'brand' | 'store' | 'item';
  name: string;
  description: string;
  image: string;
  rating: number;
  link: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: 1,
    type: 'brand',
    name: 'Wool & The Gang',
    description: 'Premium sustainable yarn and knitting kits for modern makers',
    image: 'https://images.unsplash.com/photo-1706864685950-c7db14f24290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMHlhcm4lMjBjcmFmdHxlbnwxfHx8fDE3NjcxODU3NTl8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 5,
    link: '#'
  },
  {
    id: 2,
    type: 'store',
    name: 'The Yarn Shop',
    description: 'Local store with an amazing selection of luxury yarns and tools',
    image: 'https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG5lZWRsZXMlMjB3b29sfGVufDF8fHx8MTc2NzExOTIxOXww&ixlib=rb-4.1.0&q=80&w=400',
    rating: 5,
    link: '#'
  },
  {
    id: 3,
    type: 'item',
    name: 'ChiaoGoo Needles',
    description: 'The best circular knitting needles with smooth joins',
    image: 'https://images.unsplash.com/photo-1612208141706-2fbd2d45a143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGtuaXR0ZWQlMjBzd2VhdGVyfGVufDF8fHx8MTc2NzE4NTc2MHww&ixlib=rb-4.1.0&q=80&w=400',
    rating: 5,
    link: '#'
  }
];

export function RecommendedSection() {
  return (
    <section id="recommended" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Ég mæli með!</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Þetta eru uppáhalds vörumerkin mín, verslanir og hlutir sem ég treysti og nota reglulega í prjónaskapnum mínum.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {mockRecommendations.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-3 capitalize">
                  {item.type}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <a 
                    href={item.link} 
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span className="text-sm">Learn more</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

