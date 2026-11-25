import { useState } from 'react';
import { Menu, MessageSquare, X } from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';

interface NavbarProps {
  activeSection: string;
  onOpenChat: () => void;
  unreadCount: number;
}

const NAV_LINKS = [
  { id: 'inicio', label: 'Início', href: '#inicio' },
  { id: 'bangalos', label: 'Bangalôs', href: '#bangalos' },
  { id: 'sobre', label: 'Estrutura', href: '#sobre' },
  { id: 'mapa', label: 'Mapa', href: '#mapa' },
  { id: 'contato', label: 'Contato', href: '#contato' },
];

export function Navbar({ activeSection, onOpenChat, unreadCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8F3]/95 backdrop-blur-md border-b border-[#DFE5D6]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 lg:gap-8">
        {/* Zone 1: Official Extracted SVG Logo */}
        <a
          href="#inicio"
          className="flex items-center text-[#1E261B] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] rounded-lg"
        >
          <img
            src={POUSADA_INFO.logos.dark}
            alt="Logo oficial Pousada Rural Riacho das Hortênsias"
            className="h-10 sm:h-12 w-auto object-contain shrink-0"
          />
        </a>

        {/* Zone 2: 5 clean single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-[#4E5A49]"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#1E261B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] rounded ${
                  isActive ? 'text-[#4A6B35] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#4A6B35] rounded-full"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile menu trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4A6B35]"
          >
            <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Falar no Chat</span>
            <span className="sm:hidden">Chat</span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold bg-[#9CD062] text-[#1E261B] rounded-full tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-[#1E261B] hover:bg-[#EFF2E8] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegação móvel"
          className="md:hidden bg-white border-t border-[#DFE5D6] px-4 py-3 shadow-md"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#EFF2E8] text-[#4A6B35] font-semibold'
                    : 'text-[#1E261B] hover:bg-[#F7F8F3]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
