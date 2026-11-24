import { ArrowRight, MapPin, Search, SlidersHorizontal, Users } from 'lucide-react';
import { ALL_ZONES, POUSADA_INFO } from '../data/bungalows';
import type { FilterState } from '../types/bungalow';

interface HeroSectionProps {
  filters: FilterState;
  activeFilterCount: number;
  showAdvanced: boolean;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onToggleAdvanced: () => void;
  onScrollToCatalog: () => void;
}

export function HeroSection({
  filters,
  activeFilterCount,
  showAdvanced,
  onUpdateFilter,
  onToggleAdvanced,
  onScrollToCatalog,
}: HeroSectionProps) {
  return (
    <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Main Hero Media Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#24361A] min-h-[430px] sm:min-h-[480px] lg:min-h-[520px] flex items-center">
        <img
          src="/assets/bungalows/grapia/main.jpg"
          alt="Bangalô Grápia em madeira nobre cercado pela mata nativa na Pousada Rural Riacho das Hortênsias"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02]"
        />
        {/* Measured botanical scrim for strong contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#182613]/92 via-[#1D2F17]/72 to-[#182613]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#182613]/65 via-transparent to-transparent"
        />

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-14 py-12 sm:py-16 pb-20 sm:pb-24 max-w-2xl">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#DDE9CE] mb-3">
            {POUSADA_INFO.subtitle} · Santa Helena, SC
          </p>

          <h1
            className="font-display text-white font-semibold leading-[1.1] tracking-tight"
            style={{
              fontSize: 'clamp(2.15rem, 4.4vw, 3.65rem)',
              textWrap: 'balance',
            }}
          >
            Encontre seu{' '}
            <span className="text-[#A3D96C]">Refúgio Natural</span> com Facilidade
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#E9F0E1] leading-relaxed max-w-xl">
            {POUSADA_INFO.tagline} Conheça os 8 bangalôs exclusivos em Linha Bela Vista, com
            reserva transparente e atendimento direto com os proprietários.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full shadow-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3D96C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182613]"
            >
              <span>Explorar Bangalôs</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="#mapa"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/95 hover:text-white bg-white/12 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MapPin className="w-4 h-4 text-[#A3D96C]" aria-hidden="true" />
              <span>Ver Mapa da Pousada</span>
            </a>
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

            {/* Price Range Selector */}
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
                <option value="up-to-320">Até R$ 320 / noite</option>
                <option value="320-to-400">R$ 320 a R$ 400</option>
                <option value="above-400">Acima de R$ 400</option>
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
                <option value={5}>5+ hóspedes</option>
                <option value={6}>6 hóspedes</option>
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
                placeholder="Ex: Tarzan, piscina..."
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
