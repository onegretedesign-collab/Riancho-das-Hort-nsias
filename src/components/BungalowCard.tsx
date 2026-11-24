import {
  ArrowRight,
  BedDouble,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Maximize2,
  Star,
  Users,
} from 'lucide-react';
import type { Bungalow } from '../types/bungalow';
import { formatBRL } from '../utils/filters';

interface BungalowCardProps {
  bungalow: Bungalow;
  rating: number;
  reviewCount: number;
  onOpenModal: (bungalow: Bungalow) => void;
}

export function BungalowCard({
  bungalow,
  rating,
  reviewCount,
  onOpenModal,
}: BungalowCardProps) {
  const formattedNextDate = bungalow.nextAvailableDate.split('-').reverse().slice(0, 2).join('/');

  return (
    <article className="group bg-white rounded-2xl border border-[#E4EAD9] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Photo Thumbnail Trigger */}
      <button
        type="button"
        onClick={() => onOpenModal(bungalow)}
        aria-label={`Abrir fotos e detalhes de ${bungalow.name}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFF2E8] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4A6B35]"
      >
        <img
          src={bungalow.photos[0]?.url}
          alt={bungalow.photos[0]?.caption || bungalow.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"
        />

        {/* Semantic Availability Label (Icon + Text — never color-only) */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${
            bungalow.availableNow
              ? 'bg-white/92 text-[#24361A]'
              : 'bg-[#1E261B]/85 text-[#F7F8F3]'
          }`}
        >
          {bungalow.availableNow ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B35] shrink-0" aria-hidden="true" />
              <span>Disponível</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-[#E8C56E] shrink-0" aria-hidden="true" />
              <span>Livre em {formattedNextDate}</span>
            </>
          )}
        </span>

        {/* Unit Photo Gallery Count */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E261B]/75 backdrop-blur-sm text-white text-xs font-medium tabular-nums">
          <Camera className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{bungalow.photos.length} fotos</span>
        </span>
      </button>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#1E261B] leading-snug">{bungalow.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#6D7A67]">
              <MapPin className="w-3.5 h-3.5 text-[#4A6B35] shrink-0" aria-hidden="true" />
              <span>{bungalow.zone} · Santa Helena, SC</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#1E261B] shrink-0 pt-0.5 tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#4A6B35] text-[#4A6B35]" aria-hidden="true" />
            <span>{rating > 0 ? rating.toFixed(1) : 'Novo'}</span>
            <span className="text-[#6D7A67] font-normal">({reviewCount})</span>
          </div>
        </div>

        <p className="mt-2.5 text-sm text-[#4E5A49] line-clamp-2 leading-relaxed">
          {bungalow.shortTagline}
        </p>

        {/* Clean Unboxed Specs Row matching reference layout */}
        <div className="mt-4 pt-3.5 border-t border-[#EDF1E6] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#4E5A49] tabular-nums">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
            Até {bungalow.maxGuests} hóspedes
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
            {bungalow.bedrooms} {bungalow.bedrooms > 1 ? 'quartos' : 'quarto'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
            {bungalow.areaSqm} m²
          </span>
        </div>

        {/* Footer Price + Olive CTA matching Evernest card */}
        <div className="mt-5 pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-bold text-[#1E261B] tabular-nums">
              {formatBRL(bungalow.pricePerNight)}
            </span>
            <span className="text-xs text-[#6D7A67]"> / noite</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenModal(bungalow)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] focus-visible:ring-offset-1"
          >
            <span>Ver Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
