import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Coffee,
  Compass,
  Eye,
  MapPin,
  MessageSquare,
  Minus,
  Plus,
  RotateCcw,
  Star,
  Trees,
  Waves,
} from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';
import type { Bungalow, Review } from '../types/bungalow';
import { formatBRL, getAverageRating } from '../utils/filters';

interface InteractiveMapProps {
  allBungalows: Bungalow[];
  filteredIds: Set<string>;
  reviews: Review[];
  onOpenModal: (bungalow: Bungalow) => void;
  onOpenChatWithUnit: (bungalow: Bungalow) => void;
}

export function InteractiveMap({
  allBungalows,
  filteredIds,
  reviews,
  onOpenModal,
  onOpenChatWithUnit,
}: InteractiveMapProps) {
  const [selectedId, setSelectedId] = useState<string>('tarzan');
  const [zoom, setZoom] = useState<number>(1);
  const [onlyAvailableOnMap, setOnlyAvailableOnMap] = useState<boolean>(false);

  const selectedUnit = allBungalows.find((b) => b.id === selectedId) || allBungalows[0];
  const selectedRating = getAverageRating(reviews, selectedUnit.id);

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))));

  return (
    <section id="mapa" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-[#4A6B35]">
            {POUSADA_INFO.address} · {POUSADA_INFO.coordinates.label}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E261B] mt-1">
            Mapa Interativo das <span className="text-[#4A6B35]">Unidades</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#4E5A49] max-w-2xl">
            Clique nos marcadores para ver a distância até o riacho, piscina e café colonial,
            comparar a localização na mata e abrir a galeria de cada bangalô.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#DFE5D6] rounded-full text-xs sm:text-sm font-medium text-[#1E261B] cursor-pointer self-start md:self-auto shrink-0">
          <input
            type="checkbox"
            checked={onlyAvailableOnMap}
            onChange={(e) => setOnlyAvailableOnMap(e.target.checked)}
            className="w-4 h-4 accent-[#4A6B35] cursor-pointer"
          />
          <span>Destacar somente disponíveis</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Estate Topographic Map Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#DFE5D6] shadow-sm overflow-hidden flex flex-col">
          {/* Map Toolbar */}
          <div className="px-4 sm:px-5 py-3 bg-[#EFF2E8] border-b border-[#DFE5D6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4E5A49]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                Disponível
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9C6A1B]" aria-hidden="true" />
                Reservado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-[#3B82A6]" aria-hidden="true" />
                Riacho & Piscina
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Diminuir zoom do mapa"
                disabled={zoom <= 1}
                className="w-8 h-8 rounded-lg bg-white border border-[#DFE5D6] flex items-center justify-center text-[#1E261B] hover:bg-[#F7F8F3] disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-semibold tabular-nums text-[#1E261B]">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Aumentar zoom do mapa"
                disabled={zoom >= 1.5}
                className="w-8 h-8 rounded-lg bg-white border border-[#DFE5D6] flex items-center justify-center text-[#1E261B] hover:bg-[#F7F8F3] disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {zoom > 1 && (
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  aria-label="Resetar zoom do mapa"
                  className="w-8 h-8 rounded-lg bg-white border border-[#DFE5D6] flex items-center justify-center text-[#4A6B35] hover:bg-[#F7F8F3] cursor-pointer ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable / Zoomable Topographic Estate Viewport */}
          <div className="relative overflow-auto flex-1 min-h-[370px] sm:min-h-[450px] bg-[#E7EFE0]">
            <div
              className="relative w-full h-full min-h-[370px] sm:min-h-[450px] origin-top-left transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Crisp Architectural Estate SVG Map */}
              <svg
                viewBox="0 0 1000 620"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full"
              >
                {/* Base natural pasture & forest canvas */}
                <rect width="1000" height="620" fill="#E6EEDF" />
                {/* Forest canopy contour zones */}
                <path
                  d="M0 0 H620 C590 120 510 180 420 220 C310 265 240 360 150 420 C80 465 30 480 0 490 Z"
                  fill="#D6E5C9"
                />
                <path
                  d="M170 620 C240 500 320 430 460 400 C570 375 640 460 660 620 Z"
                  fill="#D3E2C5"
                />
                {/* Topographic contour hairlines */}
                <path
                  d="M40 90 Q240 160 440 110 T840 150"
                  fill="none"
                  stroke="#C4D6B6"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                <path
                  d="M60 280 Q280 340 480 260 T920 310"
                  fill="none"
                  stroke="#C4D6B6"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                {/* Stone walking trails connecting bungalows */}
                <path
                  d="M840 160 C720 190 610 250 480 270 C360 290 250 220 180 320 C140 380 280 440 350 410 C430 380 510 430 560 440 C650 455 720 420 790 390"
                  fill="none"
                  stroke="#C9BFA9"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M840 160 C720 190 610 250 480 270 C360 290 250 220 180 320 C140 380 280 440 350 410 C430 380 510 430 560 440 C650 455 720 420 790 390"
                  fill="none"
                  stroke="#F3EFE4"
                  strokeWidth="5"
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                />
                {/* Meandering Riacho das Hortênsias stream */}
                <path
                  d="M620 0 C580 120 650 210 590 310 C535 400 450 470 430 620"
                  fill="none"
                  stroke="#A8D4E6"
                  strokeWidth="30"
                  strokeLinecap="round"
                />
                <path
                  d="M620 0 C580 120 650 210 590 310 C535 400 450 470 430 620"
                  fill="none"
                  stroke="#D9EFF8"
                  strokeWidth="8"
                  strokeDasharray="16 14"
                  strokeLinecap="round"
                />
                {/* Swimming Pool & Lawn Area */}
                <rect
                  x="795"
                  y="395"
                  width="135"
                  height="95"
                  rx="24"
                  fill="#CFE3BE"
                  stroke="#B6D1A1"
                  strokeWidth="2"
                />
                <rect
                  x="822"
                  y="418"
                  width="82"
                  height="46"
                  rx="14"
                  fill="#6CB7D4"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                />
                {/* Reception & Colonial Breakfast Deck */}
                <rect
                  x="800"
                  y="95"
                  width="145"
                  height="80"
                  rx="18"
                  fill="#F7F8F3"
                  stroke="#B8C8A7"
                  strokeWidth="2"
                />
              </svg>

              {/* Static Landmark Labels */}
              <div
                aria-hidden="true"
                className="absolute top-[18%] right-[6%] pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-semibold text-[#24361A] shadow-sm"
              >
                <Coffee className="w-3.5 h-3.5 text-[#4A6B35]" />
                <span>Recepção & Café</span>
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-[15%] right-[6%] pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-semibold text-[#1E5670] shadow-sm"
              >
                <Waves className="w-3.5 h-3.5 text-[#3B82A6]" />
                <span>Piscina & Gramado</span>
              </div>

              <div
                aria-hidden="true"
                className="absolute top-[8%] left-[5%] pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#24361A]/80 text-[11px] font-medium text-white"
              >
                <Trees className="w-3.5 h-3.5 text-[#A3D96C]" />
                <span>Trilha da Mata Nativa</span>
              </div>

              {/* Compass Indicator */}
              <div
                aria-hidden="true"
                className="absolute bottom-3 left-3 pointer-events-none inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/88 text-[11px] font-semibold text-[#4E5A49] border border-[#DFE5D6]"
              >
                <Compass className="w-3.5 h-3.5 text-[#4A6B35]" />
                <span>Norte · Linha Bela Vista</span>
              </div>

              {/* Interactive Bungalow Pins */}
              {allBungalows.map((unit) => {
                const isSelected = unit.id === selectedUnit.id;
                const matchesActiveFilters = filteredIds.has(unit.id);
                const dimmed =
                  !matchesActiveFilters || (onlyAvailableOnMap && !unit.availableNow);

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedId(unit.id)}
                    aria-label={`Selecionar ${unit.name} no mapa — ${formatBRL(
                      unit.pricePerNight
                    )} por noite, ${unit.availableNow ? 'Disponível' : 'Reservado'}`}
                    aria-pressed={isSelected}
                    style={{
                      left: `${unit.mapPosition.x}%`,
                      top: `${unit.mapPosition.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold shadow-md border-2 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E261B] ${
                      isSelected
                        ? 'bg-[#24361A] text-white border-[#A3D96C] scale-110 z-20'
                        : unit.availableNow
                          ? 'bg-white text-[#1E261B] border-[#4A6B35] hover:bg-[#4A6B35] hover:text-white'
                          : 'bg-[#F5EFE2] text-[#7A5314] border-[#C99A49]'
                    } ${dimmed && !isSelected ? 'opacity-35' : 'opacity-100'}`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">{unit.name.replace('Bangalô ', '')}</span>
                    <span className="sm:hidden">{formatBRL(unit.pricePerNight)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Quick Selector Strip below map */}
          <div className="px-4 py-3 bg-[#F7F8F3] border-t border-[#DFE5D6] flex items-center gap-2 overflow-x-auto">
            {allBungalows.map((unit) => {
              const isSelected = unit.id === selectedUnit.id;
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedId(unit.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A6B35] text-white'
                      : 'bg-white border border-[#DFE5D6] text-[#4E5A49] hover:text-[#1E261B]'
                  }`}
                >
                  {unit.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Unit Location Inspector Card */}
        <aside
          aria-label="Detalhes da unidade selecionada no mapa"
          className="lg:col-span-4 bg-white rounded-3xl border border-[#DFE5D6] shadow-sm overflow-hidden flex flex-col"
        >
          <div className="relative aspect-[16/10] bg-[#EFF2E8]">
            <img
              src={selectedUnit.photos[0]?.url}
              alt={selectedUnit.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${
                selectedUnit.availableNow
                  ? 'bg-white/92 text-[#24361A]'
                  : 'bg-[#1E261B]/85 text-white'
              }`}
            >
              {selectedUnit.availableNow ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                  <span>Disponível agora</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-[#E8C56E]" aria-hidden="true" />
                  <span>
                    Livre em {selectedUnit.nextAvailableDate.split('-').reverse().join('/')}
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-[#1E261B]">{selectedUnit.name}</h3>
                  <p className="text-xs text-[#6D7A67] mt-0.5">{selectedUnit.zone}</p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#4A6B35] tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#4A6B35]" aria-hidden="true" />
                  <span>{selectedRating.average.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-2.5 text-sm text-[#4E5A49] leading-relaxed">
                {selectedUnit.shortTagline}
              </p>

              {/* Walking Distances Grid */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#F7F8F3] rounded-xl p-2.5 border border-[#EDF1E6]">
                  <p className="text-sm font-bold text-[#1E261B] tabular-nums">
                    {selectedUnit.mapPosition.distanceToStreamM}m
                  </p>
                  <p className="text-[11px] text-[#6D7A67]">do Riacho</p>
                </div>
                <div className="bg-[#F7F8F3] rounded-xl p-2.5 border border-[#EDF1E6]">
                  <p className="text-sm font-bold text-[#1E261B] tabular-nums">
                    {selectedUnit.mapPosition.distanceToPoolM}m
                  </p>
                  <p className="text-[11px] text-[#6D7A67]">da Piscina</p>
                </div>
                <div className="bg-[#F7F8F3] rounded-xl p-2.5 border border-[#EDF1E6]">
                  <p className="text-sm font-bold text-[#1E261B] tabular-nums">
                    {selectedUnit.mapPosition.distanceToReceptionM}m
                  </p>
                  <p className="text-[11px] text-[#6D7A67]">do Café</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EDF1E6] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#6D7A67]">Diária transparente</span>
                <p className="text-xl font-bold text-[#1E261B] tabular-nums">
                  {formatBRL(selectedUnit.pricePerNight)}
                  <span className="text-xs font-normal text-[#6D7A67]"> / noite</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenModal(selectedUnit)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Ver Fotos</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChatWithUnit(selectedUnit)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E261B] bg-[#EFF2E8] hover:bg-[#DFE5D6] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#4A6B35]" aria-hidden="true" />
                  <span>Chat Direto</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
