import { Calendar, Check, RotateCcw } from 'lucide-react';
import { AMENITY_LABELS } from '../data/bungalows';
import type { AmenityId, FilterState, SortOption } from '../types/bungalow';
import { formatBRL } from '../utils/filters';

interface AdvancedFiltersProps {
  filters: FilterState;
  totalCount: number;
  filteredCount: number;
  activeFilterCount: number;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onToggleAmenity: (amenity: AmenityId) => void;
  onResetFilters: () => void;
}

const FEATURED_AMENITIES: AmenityId[] = [
  'ar-condicionado',
  'cozinha-propria',
  'churrasqueira',
  'varanda-privativa',
  'casa-na-arvore',
  'servico-quarto',
  'agua-quente-fria',
  'roupa-cama-toalhas',
  'vista-mata',
  'estacionamento',
];

export function AdvancedFilters({
  filters,
  totalCount,
  filteredCount,
  activeFilterCount,
  onUpdateFilter,
  onToggleAmenity,
  onResetFilters,
}: AdvancedFiltersProps) {
  return (
    <div
      aria-label="Filtros avançados de busca"
      className="mt-5 mx-2 sm:mx-6 lg:mx-10 bg-white border border-[#DFE5D6] rounded-2xl p-5 sm:p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-5 border-b border-[#EDF1E6]">
        {/* Max Price Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#4E5A49] mb-2">
            <label htmlFor="max-price-slider">Diária máxima</label>
            <span className="text-[#4A6B35] font-bold tabular-nums">
              Até {formatBRL(filters.maxPrice)}
            </span>
          </div>
          <input
            id="max-price-slider"
            type="range"
            min={250}
            max={600}
            step={10}
            value={filters.maxPrice}
            onChange={(e) => onUpdateFilter('maxPrice', Number(e.target.value))}
            className="w-full accent-[#4A6B35] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#6D7A67] mt-1 tabular-nums">
            <span>R$ 250</span>
            <span>R$ 360</span>
            <span>R$ 600</span>
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <label
            htmlFor="filter-checkin"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5A49] mb-2"
          >
            <Calendar className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
            <span>Check-in desejado</span>
          </label>
          <input
            id="filter-checkin"
            type="date"
            value={filters.checkIn}
            min="2026-11-24"
            onChange={(e) => onUpdateFilter('checkIn', e.target.value)}
            className="w-full px-3 py-2 text-sm text-[#1E261B] bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label
            htmlFor="filter-checkout"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5A49] mb-2"
          >
            <Calendar className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
            <span>Check-out desejado</span>
          </label>
          <input
            id="filter-checkout"
            type="date"
            value={filters.checkOut}
            min={filters.checkIn || '2026-11-25'}
            onChange={(e) => onUpdateFilter('checkOut', e.target.value)}
            className="w-full px-3 py-2 text-sm text-[#1E261B] bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
          />
        </div>

        {/* Sort & Immediate Availability */}
        <div className="flex flex-col justify-between gap-2.5">
          <div>
            <label
              htmlFor="filter-sort"
              className="block text-xs font-semibold text-[#4E5A49] mb-1.5"
            >
              Ordenar resultados
            </label>
            <select
              id="filter-sort"
              value={filters.sortBy}
              onChange={(e) => onUpdateFilter('sortBy', e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm text-[#1E261B] bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35] cursor-pointer"
            >
              <option value="featured">Destaques do catálogo</option>
              <option value="price-asc">Menor preço por noite</option>
              <option value="price-desc">Maior preço por noite</option>
              <option value="rating-desc">Melhor avaliação dos hóspedes</option>
              <option value="capacity-desc">Maior capacidade de hóspedes</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#1E261B] cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => onUpdateFilter('availableOnly', e.target.checked)}
              className="w-4 h-4 rounded accent-[#4A6B35] cursor-pointer"
            />
            <span>Somente disponíveis agora</span>
          </label>
        </div>
      </div>

      {/* Amenities Multi-Select Buttons */}
      <div className="pt-4">
        <p className="text-xs font-semibold text-[#4E5A49] mb-3">Comodidades oficiais</p>
        <div className="flex flex-wrap gap-2">
          {FEATURED_AMENITIES.map((amenity) => {
            const active = filters.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => onToggleAmenity(amenity)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#4A6B35] border-[#4A6B35] text-white'
                    : 'bg-[#F7F8F3] border-[#DFE5D6] text-[#4E5A49] hover:border-[#4A6B35]/60 hover:text-[#1E261B]'
                }`}
              >
                {active && <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                <span>{AMENITY_LABELS[amenity]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Summary & Reset Footer */}
      <div className="mt-5 pt-4 border-t border-[#EDF1E6] flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[#4E5A49]">
          Exibindo{' '}
          <strong className="text-[#1E261B] tabular-nums">{filteredCount}</strong> de{' '}
          <span className="tabular-nums">{totalCount}</span> bangalôs oficiais
        </p>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#4A6B35] hover:text-[#24361A] hover:bg-[#EFF2E8] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Limpar filtros ({activeFilterCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
