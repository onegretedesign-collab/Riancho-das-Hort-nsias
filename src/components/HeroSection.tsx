import { useEffect, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { ALL_ZONES, BUNGALOWS, HERO_BANNERS } from '../data/bungalows';
import type { Bungalow, FilterState } from '../types/bungalow';

interface HeroSectionProps {
  filters: FilterState;
  activeFilterCount: number;
  showAdvanced: boolean;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onToggleAdvanced: () => void;
  onScrollToCatalog: () => void;
  onOpenBungalow?: (bungalow: Bungalow) => void;
}

export function HeroSection({
  filters,
  activeFilterCount,
  showAdvanced,
  onUpdateFilter,
  onToggleAdvanced,
  onScrollToCatalog,
  onOpenBungalow,
}: HeroSectionProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = HERO_BANNERS[activeSlideIndex] || HERO_BANNERS[0];
  const linkedBungalow = currentSlide.bungalowId
    ? BUNGALOWS.find((b) => b.id === currentSlide.bungalowId) || null
    : null;

  const handlePrimaryCta = () => {
    if (linkedBungalow && onOpenBungalow) {
      onOpenBungalow(linkedBungalow);
    } else {
      onScrollToCatalog();
    }
  };

  return (
    <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Main Hero Banner Carousel — Normalized Fixed Height matching reference image_789ad173.png & Continuous Autoplay without Prev/Next Buttons */}
      <div className="relative rounded-3xl overflow-hidden bg-[#24361A] h-[490px] sm:h-[535px] lg:h-[565px] flex items-center">
        {/* Stacked Preloaded Banner Images for Smooth Autoplay Crossfade without Size Jumps */}
        {HERO_BANNERS.map((slide, index) => {
          const isCurrent = index === activeSlideIndex;
          return (
            <img
              key={slide.id}
              src={slide.imageUrl}
              alt={`${slide.title} ${slide.highlight} — Pousada Rural Riacho das Hortênsias`}
              referrerPolicy="no-referrer"
              aria-hidden={!isCurrent}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            />
          );
        })}

        {/* Measured botanical scrim for strong contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-gradient-to-r from-[#182613]/92 via-[#1D2F17]/74 to-[#182613]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-gradient-to-t from-[#182613]/70 via-transparent to-transparent"
        />

        {/* Normalized Fixed-Height Inner Content Box so 2-line and 3-line titles never alter the banner height */}
        <div className="relative z-10 w-full h-full px-6 sm:px-12 lg:px-14 pt-10 sm:pt-12 pb-20 sm:pb-24 max-w-2xl flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#DDE9CE] mb-2.5 truncate">
            {currentSlide.kicker}
          </p>

          {/* Fixed height title slot accommodates up to 3 lines identically to image_789ad173.png */}
          <div className="min-h-[118px] sm:min-h-[156px] lg:min-h-[178px] flex items-center">
            <h1
              className="font-display text-white font-semibold leading-[1.08] tracking-tight line-clamp-3"
              style={{
                fontSize: 'clamp(2.1rem, 4.3vw, 3.55rem)',
                textWrap: 'balance',
              }}
            >
              {currentSlide.title}{' '}
              <span className="text-[#A3D96C]">{currentSlide.highlight}</span>
            </h1>
          </div>

          <p className="mt-3 text-sm sm:text-base text-[#E9F0E1] leading-relaxed max-w-xl line-clamp-2 min-h-[44px] sm:min-h-[52px]">
            {currentSlide.subtitle}
          </p>

          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-[#F4C46D] tabular-nums min-h-[20px]">
            {currentSlide.priceLabel || 'Diárias oficiais a partir de R$ 250,00'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full shadow-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3D96C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182613]"
            >
              <span>
                {linkedBungalow ? `Ver ${linkedBungalow.name}` : 'Explorar 13 Bangalôs'}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/95 hover:text-white bg-white/12 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MapPin className="w-4 h-4 text-[#A3D96C]" aria-hidden="true" />
              <span>Contato & Localização</span>
            </a>
          </div>

          {/* Subtle Autoplay Progress Indicators */}
          <div
            aria-hidden="true"
            className="mt-5 flex items-center gap-2"
          >
            {HERO_BANNERS.map((slide, idx) => {
              const active = idx === activeSlideIndex;
              return (
                <span
                  key={slide.id}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    active ? 'w-8 bg-[#D99B38]' : 'w-2.5 bg-white/45'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Overlapping Search & Quick Filter Bar (Evernest Signature Motif) */}
      <div className="relative z-20 -mt-10 sm:-mt-11 mx-2 sm:mx-6 lg:mx-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onScrollToCatalog();
          }}
          aria-label="Busca rápida de bangalôs"
          className="bg-[#EFF2E8]/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-lg border border-[#DFE5D6]"
        >
          <div className="bg-white rounded-xl sm:rounded-full p-2 sm:p-1.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.05fr_0.95fr_1fr_auto] gap-2 lg:gap-0 items-center">
            {/* Area / Zone Selector */}
            <label className="flex items-center gap-2.5 px-3.5 py-2.5 lg:border-r border-[#E6EBDF] cursor-pointer">
              <MapPin className="w-4 h-4 text-[#4A6B35] shrink-0" aria-hidden="true" />
              <span className="sr-only">Selecionar área da pousada</span>
              <select
                aria-label="Área da pousada"
                value={filters.zone}
                onChange={(e) => onUpdateFilter('zone', e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[#1E261B] focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">Todas as áreas</option>
                {ALL_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>

            {/* Official Price Range Selector */}
            <label className="flex items-center gap-2.5 px-3.5 py-2.5 lg:border-r border-[#E6EBDF] cursor-pointer">
              <span className="text-xs font-semibold text-[#4A6B35] shrink-0" aria-hidden="true">
                R$
              </span>
              <span className="sr-only">Faixa de preço por noite</span>
              <select
                aria-label="Faixa de preço"
                value={filters.priceRange}
                onChange={(e) =>
                  onUpdateFilter('priceRange', e.target.value as FilterState['priceRange'])
                }
                className="w-full bg-transparent text-sm font-medium text-[#1E261B] focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">Qualquer diária</option>
                <option value="up-to-250">Até R$ 250 / noite</option>
                <option value="251-to-360">R$ 300 a R$ 360 / noite</option>
                <option value="above-360">R$ 420 a R$ 600 / noite</option>
              </select>
            </label>

            {/* Guests Selector */}
            <label className="flex items-center gap-2.5 px-3.5 py-2.5 lg:border-r border-[#E6EBDF] cursor-pointer">
              <Users className="w-4 h-4 text-[#4A6B35] shrink-0" aria-hidden="true" />
              <span className="sr-only">Quantidade de hóspedes</span>
              <select
                aria-label="Hóspedes"
                value={filters.minGuests}
                onChange={(e) => onUpdateFilter('minGuests', Number(e.target.value))}
                className="w-full bg-transparent text-sm font-medium text-[#1E261B] focus:outline-none cursor-pointer pr-1"
              >
                <option value={1}>Hóspedes (todos)</option>
                <option value={2}>2+ hóspedes</option>
                <option value={4}>4+ hóspedes</option>
                <option value={6}>6+ hóspedes</option>
                <option value={8}>8 a 10 hóspedes</option>
              </select>
            </label>

            {/* Text Search Input */}
            <label className="flex items-center gap-2 px-3.5 py-2.5">
              <Search className="w-4 h-4 text-[#6D7A67] shrink-0" aria-hidden="true" />
              <span className="sr-only">Buscar por nome do bangalô</span>
              <input
                type="search"
                aria-label="Buscar bangalô"
                value={filters.searchQuery}
                onChange={(e) => onUpdateFilter('searchQuery', e.target.value)}
                placeholder="Ex: Guajuvira, Tarzan..."
                className="w-full bg-transparent text-sm text-[#1E261B] placeholder:text-[#7D8A77] focus:outline-none"
              />
            </label>

            {/* Actions: Advanced Filters Toggle + Submit Search */}
            <div className="flex items-center justify-end gap-2 sm:col-span-2 lg:col-span-1 pt-1 lg:pt-0 lg:pl-2">
              <button
                type="button"
                onClick={onToggleAdvanced}
                aria-expanded={showAdvanced}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  showAdvanced || activeFilterCount > 0
                    ? 'bg-[#EFF2E8] border-[#4A6B35] text-[#24361A]'
                    : 'bg-white border-[#DFE5D6] text-[#4E5A49] hover:border-[#4A6B35]/50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-[#4A6B35] text-white rounded-full tabular-nums">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] focus-visible:ring-offset-1"
              >
                <span>Buscar</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
