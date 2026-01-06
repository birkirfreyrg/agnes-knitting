import { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoImage from '../assets/agnes_logo.jpg';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    // Close mobile menu after navigation
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header ref={headerRef} className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Scroll to top"
          >
            <img src={logoImage} alt="Agnes Knitting Logo" className="h-10 w-10 md:h-12 md:w-12" />
            <span className="ml-2 md:ml-3 text-lg md:text-xl font-semibold text-gray-800">
              Agnes Knitting
            </span>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8">
            <button
              onClick={() => scrollToSection('posts')}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Færslur
            </button>
            <button
              onClick={() => scrollToSection('instagram')}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Instagram
            </button>
            <button
              onClick={() => scrollToSection('recommended')}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Ráðleggingar
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('posts')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
              >
                Færslur
              </button>
              <button
                onClick={() => scrollToSection('instagram')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
              >
                Instagram
              </button>
              <button
                onClick={() => scrollToSection('recommended')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
              >
                Ráðleggingar
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
