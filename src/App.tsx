import { useEffect, useMemo, useRef, useState } from 'react';
import { Leaf, MessageSquare, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { AdvancedFilters } from './components/AdvancedFilters';
import { BungalowCard } from './components/BungalowCard';
import { BungalowModal } from './components/BungalowModal';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { InteractiveMap } from './components/InteractiveMap';
import { Navbar } from './components/Navbar';
import { OwnerChatDrawer } from './components/OwnerChatDrawer';
import { ReviewsSection } from './components/ReviewsSection';
import { WelcomeSection } from './components/WelcomeSection';
import { BUNGALOWS, INITIAL_REVIEWS } from './data/bungalows';
import type { AmenityId, Bungalow, ChatMessage, FilterState, Review } from './types/bungalow';
import {
  DEFAULT_FILTER_STATE,
  countActiveFilters,
  filterBungalows,
  generateOwnerReply,
  getAverageRating,
} from './utils/filters';

const STORAGE_REVIEWS_KEY = 'riacho_hortensias_reviews_v1';
const STORAGE_CHAT_KEY = 'riacho_hortensias_chat_v1';

function getCurrentTimeLabel(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function createInitialChatMessages(): ChatMessage[] {
  return [
    {
      id: 'sys-welcome',
      sender: 'system',
      text: 'Canal oficial verificado da Pousada Rural Riacho das Hortênsias · Todas as negociações ficam registradas com protocolo.',
      timestamp: getCurrentTimeLabel(),
    },
    {
      id: 'owner-hello',
      sender: 'owner',
      text: 'Olá! Bem-vindo à Pousada Rural Riacho das Hortênsias em Santa Helena - SC. Estamos online para tirar dúvidas sobre os 8 bangalôs, café colonial e disponibilidade.',
      timestamp: getCurrentTimeLabel(),
    },
  ];
}

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedBungalow, setSelectedBungalow] = useState<Bungalow | null>(null);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Persistent guest reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial seed reviews
    }
    return INITIAL_REVIEWS;
  });

  // Integrated Owner Chat state
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatUnit, setChatUnit] = useState<Bungalow | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [isOwnerTyping, setIsOwnerTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to welcome thread
    }
    return createInitialChatMessages();
  });

  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    } catch {
      // Ignore storage quota errors
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    };
  }, []);

  // Track visible section for subtle top-bar underline
  useEffect(() => {
    const sections = ['inicio', 'bangalos', 'sobre', 'mapa', 'avaliacoes'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredBungalows = useMemo(
    () => filterBungalows(BUNGALOWS, filters, reviews),
    [filters, reviews]
  );

  const filteredIds = useMemo(
    () => new Set(filteredBungalows.map((b) => b.id)),
    [filteredBungalows]
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const handleUpdateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleAmenity = (amenity: AmenityId) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
  };

  const handleScrollToCatalog = () => {
    document.getElementById('bangalos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date' | 'verifiedStay'>) => {
    const today = new Date().toISOString().slice(0, 10);
    const created: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: today,
      verifiedStay: true,
    };
    setReviews((prev) => [created, ...prev]);
  };

  const handleSendChatMessage = (text: string, overrideUnit?: Bungalow | null) => {
    const unitForReply = overrideUnit !== undefined ? overrideUnit : chatUnit;
    const protocolNumber = `RH-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const guestMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'guest',
      text,
      timestamp: getCurrentTimeLabel(),
      bungalowId: unitForReply?.id,
      protocolCode: text.length > 40 ? protocolNumber : undefined,
    };

    setMessages((prev) => [...prev, guestMsg]);
    setIsOwnerTyping(true);

    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = window.setTimeout(() => {
      const replyText = generateOwnerReply(text, unitForReply);
      const ownerMsg: ChatMessage = {
        id: `msg-owner-${Date.now()}`,
        sender: 'owner',
        text: replyText,
        timestamp: getCurrentTimeLabel(),
        bungalowId: unitForReply?.id,
      };
      setMessages((prev) => [...prev, ownerMsg]);
      setIsOwnerTyping(false);
    }, 650);
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setUnreadCount(0);
  };

  const handleOpenChatWithUnit = (unit: Bungalow, prefillMessage?: string) => {
    setChatUnit(unit);
    setChatOpen(true);
    setUnreadCount(0);
    if (prefillMessage) {
      handleSendChatMessage(prefillMessage, unit);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F3] text-[#1E261B]">
      <Navbar
        activeSection={activeSection}
        onOpenChat={handleOpenChat}
        unreadCount={unreadCount}
      />

      <main className="flex-1">
        {/* Hero Banner + Overlapping Search Bar */}
        <HeroSection
          filters={filters}
          activeFilterCount={activeFilterCount}
          showAdvanced={showAdvancedFilters}
          onUpdateFilter={handleUpdateFilter}
          onToggleAdvanced={() => setShowAdvancedFilters((prev) => !prev)}
          onScrollToCatalog={handleScrollToCatalog}
        />

        {/* Expandable Advanced Filters Panel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showAdvancedFilters && (
            <AdvancedFilters
              filters={filters}
              totalCount={BUNGALOWS.length}
              filteredCount={filteredBungalows.length}
              activeFilterCount={activeFilterCount}
              onUpdateFilter={handleUpdateFilter}
              onToggleAmenity={handleToggleAmenity}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>

        {/* Featured Bungalows Catalog Grid */}
        <section
          id="bangalos"
          aria-labelledby="catalog-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2
              id="catalog-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E261B]"
              style={{ textWrap: 'balance' }}
            >
              Bangalôs em <span className="text-[#4A6B35]">Destaque</span>
            </h2>
            <div className="mt-2 flex items-center justify-center text-[#4A6B35]" aria-hidden="true">
              <Leaf className="w-4 h-4" />
            </div>
            <p className="mt-2.5 text-sm sm:text-base text-[#4E5A49]">
              Clique em qualquer unidade para abrir a galeria completa de fotos internas e
              externas, simular datas e conferir avaliações.
            </p>
          </div>

          {/* Subtle Results Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-sm">
            <p className="text-[#4E5A49]">
              Mostrando{' '}
              <strong className="text-[#1E261B] tabular-nums">{filteredBungalows.length}</strong>{' '}
              {filteredBungalows.length === 1 ? 'bangalô disponível' : 'bangalôs do catálogo'}
            </p>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#4A6B35] bg-[#EFF2E8] hover:bg-[#DFE5D6] rounded-full transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Limpar filtros ({activeFilterCount})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1E261B] bg-white border border-[#DFE5D6] hover:border-[#4A6B35] rounded-full transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                <span>{showAdvancedFilters ? 'Ocultar filtros' : 'Filtros avançados'}</span>
              </button>
            </div>
          </div>

          {filteredBungalows.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#DFE5D6] p-10 text-center max-w-xl mx-auto">
              <h3 className="font-display text-xl font-semibold text-[#1E261B]">
                Nenhum bangalô corresponde a esta combinação
              </h3>
              <p className="mt-2 text-sm text-[#4E5A49]">
                Tente ampliar a faixa de preço ou remover alguma comodidade selecionada para
                visualizar todas as opções da pousada.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Ver todos os 8 bangalôs</span>
              </button>
            </div>
          ) : (
            <div
              data-testid="bungalow-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBungalows.map((unit) => {
                const stats = getAverageRating(reviews, unit.id);
                return (
                  <BungalowCard
                    key={unit.id}
                    bungalow={unit}
                    rating={stats.average}
                    reviewCount={stats.count}
                    onOpenModal={setSelectedBungalow}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Welcome / About Editorial Section (Evernest Sage-Cream Section) */}
        <WelcomeSection onOpenChat={handleOpenChat} />

        {/* Interactive Estate Location Map */}
        <InteractiveMap
          allBungalows={BUNGALOWS}
          filteredIds={filteredIds}
          reviews={reviews}
          onOpenModal={setSelectedBungalow}
          onOpenChatWithUnit={handleOpenChatWithUnit}
        />

        {/* Guest Reviews Section */}
        <ReviewsSection
          bungalows={BUNGALOWS}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </main>

      <Footer onOpenChat={handleOpenChat} />

      {/* Bungalow Details & Photo Gallery Modal */}
      <BungalowModal
        bungalow={selectedBungalow}
        reviews={reviews}
        initialCheckIn={filters.checkIn}
        initialCheckOut={filters.checkOut}
        onClose={() => setSelectedBungalow(null)}
        onOpenChatWithUnit={handleOpenChatWithUnit}
        onAddReview={handleAddReview}
      />

      {/* Integrated Owner–Guest Secure Chat Drawer */}
      <OwnerChatDrawer
        isOpen={chatOpen}
        bungalows={BUNGALOWS}
        activeUnit={chatUnit}
        messages={messages}
        isOwnerTyping={isOwnerTyping}
        onClose={() => setChatOpen(false)}
        onSelectUnit={setChatUnit}
        onSendMessage={(text) => handleSendChatMessage(text)}
      />

      {/* Compact Floating Chat Launcher (Desktop only — mobile uses header Chat CTA) */}
      {!chatOpen && !selectedBungalow && (
        <button
          type="button"
          onClick={handleOpenChat}
          aria-label="Abrir chat direto com o proprietário"
          className="hidden md:inline-flex fixed bottom-5 right-5 z-30 items-center gap-2 px-4 py-3 rounded-full bg-[#24361A] hover:bg-[#4A6B35] text-white shadow-lg border border-white/15 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] focus-visible:ring-offset-2"
        >
          <MessageSquare className="w-5 h-5 text-[#A3D96C]" aria-hidden="true" />
          <span className="text-sm font-semibold whitespace-nowrap">Chat Direto</span>
        </button>
      )}
    </div>
  );
}
