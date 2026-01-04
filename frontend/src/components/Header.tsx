import { useRef } from 'react';
import logoImage from '../assets/agnes_logo.jpg';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header ref={headerRef} className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={scrollToTop}
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Scroll to top"
        >
          <img src={logoImage} alt="Agnes Knitting Logo" className="h-12 w-12" />
          <span className="ml-3 text-xl font-semibold text-gray-800">Agnes Knitting</span>
        </button>
        
        <nav className="flex gap-8">
          <button
            onClick={() => scrollToSection('posts')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Posts
          </button>
          <button
            onClick={() => scrollToSection('instagram')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Instagram
          </button>
          <button
            onClick={() => scrollToSection('recommended')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Recommended
          </button>
        </nav>
      </div>
    </header>
  );
}
