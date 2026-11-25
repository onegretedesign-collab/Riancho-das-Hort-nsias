import { useEffect, useRef, useState } from 'react';
import {
  BedDouble,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Expand,
  Mail,
  MapPin,
  Maximize2,
  MessageSquare,
  Phone,
  ShieldCheck,
  Snowflake,
  Star,
  Users,
  X,
} from 'lucide-react';
import { AMENITY_LABELS, POUSADA_INFO } from '../data/bungalows';
import type { Bungalow, Review } from '../types/bungalow';
import {
  calculateStayTotal,
  formatBRL,
  getAverageRating,
  isAvailableForDates,
} from '../utils/filters';

interface BungalowModalProps {
  bungalow: Bungalow | null;
  reviews: Review[];
  initialCheckIn: string;
  initialCheckOut: string;
  onClose: () => void;
  onOpenChatWithUnit: (bungalow: Bungalow, prefillMessage?: string) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'verifiedStay'>) => void;
}

type ModalTab = 'descricao' | 'detalhes' | 'booking' | 'reviews';

export function BungalowModal({
  bungalow,
  reviews,
  initialCheckIn,
  initialCheckOut,
  onClose,
  onOpenChatWithUnit,
  onAddReview,
}: BungalowModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('descricao');
  const [checkIn, setCheckIn] = useState(initialCheckIn || '2026-12-08');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '2026-12-10');
  const [guests, setGuests] = useState(2);

  const thumbStripRef = useRef<HTMLDivElement | null>(null);

  // Unit review form state
  const [authorName, setAuthorName] = useState('');
  const [authorOrigin, setAuthorOrigin] = useState('');
  const [stayType, setStayType] = useState<Review['stayType']>('Família');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!bungalow) return;
    setActivePhotoIndex(0);
    setLightboxOpen(false);
    setActiveTab('descricao');
    setGuests(Math.min(2, bungalow.maxGuests));
    setReviewError('');
    setReviewSuccess(false);
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
  }, [bungalow, initialCheckIn, initialCheckOut]);

  // Keep active thumbnail visible in the horizontal strip
  useEffect(() => {
    if (!thumbStripRef.current) return;
    const activeBtn = thumbStripRef.current.querySelector<HTMLElement>(
      `[data-thumb-index="${activePhotoIndex}"]`
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activePhotoIndex]);

  useEffect(() => {
    if (!bungalow) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % bungalow.photos.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + bungalow.photos.length) % bungalow.photos.length);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [bungalow, lightboxOpen, onClose]);

  if (!bungalow) return null;

  const unitReviews = reviews.filter((r) => r.bungalowId === bungalow.id);
  const { average, count } = getAverageRating(reviews, bungalow.id);
  const currentPhoto = bungalow.photos[activePhotoIndex] || bungalow.photos[0];
  const stayPricing = calculateStayTotal(bungalow.pricePerNight, checkIn, checkOut);
  const datesAreFree = isAvailableForDates(bungalow, checkIn, checkOut);
  const datesValid = Boolean(checkIn && checkOut && checkOut > checkIn);

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + bungalow.photos.length) % bungalow.photos.length);
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % bungalow.photos.length);
  };

  const handleBookingInquiry = () => {
    if (!datesValid || !datesAreFree) return;
    const fmtIn = checkIn.split('-').reverse().join('/');
    const fmtOut = checkOut.split('-').reverse().join('/');
    const message = `Olá! Gostaria de solicitar a reserva do ${bungalow.name} para ${guests} ${
      guests > 1 ? 'hóspedes' : 'hóspede'
    }, de ${fmtIn} a ${fmtOut} (${stayPricing.nights} ${
      stayPricing.nights > 1 ? 'diárias' : 'diária'
    }, total estimado de ${formatBRL(stayPricing.total)}). Poderia confirmar a disponibilidade?`;
    onOpenChatWithUnit(bungalow, message);
    onClose();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setReviewError('Preencha seu nome e o comentário sobre sua experiência.');
      return;
    }
    if (comment.trim().length < 10) {
      setReviewError('Escreva pelo menos 10 caracteres na sua avaliação.');
      return;
    }
    onAddReview({
      bungalowId: bungalow.id,
      authorName: authorName.trim(),
      authorOrigin: authorOrigin.trim() || 'Santa Catarina',
      stayType,
      rating,
      cleanliness: rating,
      comfort: rating,
      location: Math.min(5, rating),
      hospitality: 5,
      comment: comment.trim(),
    });
    setAuthorName('');
    setAuthorOrigin('');
    setComment('');
    setRating(5);
    setReviewError('');
    setReviewSuccess(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bungalow-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-[#182613]/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[92vh] bg-[#EFEDE7] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#D8D5CA] flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-white border-b border-[#E2DFD5] shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <h2
                id="bungalow-modal-title"
                className="font-display text-xl sm:text-2xl font-semibold text-[#1E261B] truncate"
              >
                {bungalow.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6B35] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#4A6B35]" aria-hidden="true" />
                {average > 0 ? average.toFixed(1) : '4.9'} ({count})
              </span>
              <span className="text-xs font-bold text-[#9A6818] bg-[#FAF0DC] border border-[#E9CF9B] px-2.5 py-0.5 rounded-md tabular-nums">
                DIÁRIA: {formatBRL(bungalow.pricePerNight)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6D7A67] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#4A6B35] shrink-0" aria-hidden="true" />
              <span>
                {bungalow.zone} · {POUSADA_INFO.address}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Fechar detalhes de ${bungalow.name}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EFF2E8] hover:bg-[#DFE5D6] text-[#1E261B] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-7 py-4 sm:py-5 space-y-4">
          {/* Top Grid matching reference image_618666ed.png: Left Full-Res 3:2 Gallery + Right "Consultar Disponibilidade" Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (8 cols): True 3:2 Full-Size Photo + 4-Up Thumbnail Strip with Golden Circular Arrows */}
            <div className="lg:col-span-8 space-y-2.5">
              {/* Main Full-Size 3:2 Official Photograph Viewer (1000x667 / 1452x968 exact ratio) */}
              <div className="relative w-full aspect-[3/2] max-h-[340px] sm:max-h-[380px] rounded-xl overflow-hidden bg-[#1E261B] shadow-md group">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300"
                />

                {/* Top-left Photo Counter & Caption Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-semibold tabular-nums">
                    Foto {activePhotoIndex + 1} de {bungalow.photos.length}
                  </span>
                </div>

                {/* Top-right Full-Size Zoom Trigger */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Ampliar foto em tamanho original"
                  className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/70 hover:bg-[#D99B38] text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tamanho real</span>
                </button>

                {/* Main Viewer Left/Right Controls */}
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/55 hover:bg-[#D99B38] text-white shadow-md flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/55 hover:bg-[#D99B38] text-white shadow-md flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Subtle Caption Bar */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 py-2">
                  <p className="text-xs sm:text-sm text-white font-medium truncate">
                    {currentPhoto.caption}
                  </p>
                </div>
              </div>

              {/* Thumbnail Carousel Strip with Golden-Amber Circular Arrow Buttons (Exact match to image_618666ed.png) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  aria-label="Miniatura anterior"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#D99B38] hover:bg-[#C08526] text-white shadow-md flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E261B]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={thumbStripRef}
                  role="list"
                  aria-label={`Galeria de miniaturas de ${bungalow.name}`}
                  className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1"
                >
                  {bungalow.photos.map((photo, index) => {
                    const isSelected = index === activePhotoIndex;
                    return (
                      <button
                        key={photo.url}
                        type="button"
                        data-thumb-index={index}
                        onClick={() => setActivePhotoIndex(index)}
                        aria-label={`Ver foto ${index + 1}: ${photo.caption}`}
                        aria-current={isSelected ? 'true' : undefined}
                        className={`relative shrink-0 w-32 sm:w-36 aspect-[3/2] rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B38] ${
                          isSelected
                            ? 'border-[#D99B38] opacity-100 shadow-sm scale-[1.01]'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNextPhoto}
                  aria-label="Próxima miniatura"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#D99B38] hover:bg-[#C08526] text-white shadow-md flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E261B]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column (4 cols): Dark Charcoal "Consultar Disponibilidade" Card (Exact match to image_618666ed.png) */}
            <aside className="lg:col-span-4 bg-[#2C2D30] text-white rounded-xl p-5 shadow-md space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Consultar Disponibilidade
                </h3>
                <p className="mt-0.5 text-xs text-gray-300">
                  Canais diretos oficiais da Pousada
                </p>
              </div>

              <div className="space-y-3 pt-0.5">
                <a
                  href={POUSADA_INFO.phones.availabilityWhatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-100 hover:text-[#D99B38] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-[#D99B38]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#D99B38]" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block font-semibold tabular-nums text-xs sm:text-sm">
                      {POUSADA_INFO.phones.availability}
                    </span>
                    <span className="block text-[11px] text-gray-400">
                      Central de Disponibilidade
                    </span>
                  </div>
                </a>

                <a
                  href={POUSADA_INFO.phones.reservationsWhatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-100 hover:text-[#D99B38] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-[#D99B38]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#A3D96C]" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block font-semibold tabular-nums text-xs sm:text-sm">
                      {POUSADA_INFO.phones.reservations}
                    </span>
                    <span className="block text-[11px] text-gray-400">
                      Setor de Reservas
                    </span>
                  </div>
                </a>

                <a
                  href={POUSADA_INFO.phones.generalWhatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-100 hover:text-[#D99B38] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-[#D99B38]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#A3D96C]" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block font-semibold tabular-nums text-xs sm:text-sm">
                      {POUSADA_INFO.phones.general}
                    </span>
                    <span className="block text-[11px] text-gray-400">
                      Atendimento Geral & Restaurante
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${POUSADA_INFO.emails.reservationsRecipient}`}
                  className="flex items-center gap-2.5 text-sm text-gray-100 hover:text-[#D99B38] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-[#D99B38]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#D99B38]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="block font-medium text-[11px] whitespace-nowrap truncate">
                      {POUSADA_INFO.emails.reservationsRecipient}
                    </span>
                    <span className="block text-[11px] text-gray-400 truncate">
                      {POUSADA_INFO.emails.contactFormRecipient}
                    </span>
                  </div>
                </a>
              </div>

              {/* Official Daily Price Box inside Availability Card */}
              <div className="pt-2.5 border-t border-white/12 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                  Valor da Diária
                </span>
                <span className="text-xl font-bold text-[#F3B95F] tabular-nums">
                  {formatBRL(bungalow.pricePerNight)}
                </span>
              </div>

              {/* Action Buttons inside Dark Card */}
              <div className="space-y-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onOpenChatWithUnit(bungalow);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D99B38] hover:bg-[#C38728] rounded-full transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Consultar no Chat Agora</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-gray-100 bg-white/10 hover:bg-white/18 rounded-full transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D99B38]" aria-hidden="true" />
                  <span>Simular Datas & Valores</span>
                </button>
              </div>
            </aside>
          </div>

          {/* Editorial Tab Bar matching reference image_618666ed.png (DESCRIÇÃO | DETALHES | SIMULAR ESTADIA | AVALIAÇÕES) */}
          <div
            role="tablist"
            aria-label="Seções de detalhes do bangalô"
            className="flex flex-wrap items-center gap-6 border-b border-[#D5D2C6] pt-2"
          >
            {(
              [
                { id: 'descricao', label: 'DESCRIÇÃO' },
                { id: 'detalhes', label: 'DETALHES' },
                { id: 'booking', label: 'SIMULAR ESTADIA' },
                { id: 'reviews', label: `AVALIAÇÕES (${unitReviews.length})` },
              ] as const
            ).map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase transition-colors cursor-pointer border-b-[3px] -mb-[1px] ${
                    isSelected
                      ? 'border-[#D99B38] text-[#1E261B]'
                      : 'border-transparent text-[#5E685A] hover:text-[#1E261B]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: DESCRIÇÃO (Exact Official Description + Complete Information) */}
          {activeTab === 'descricao' && (
            <div className="space-y-5">
              {/* Official Website Description Callout matching image_618666ed.png */}
              <div className="bg-white rounded-xl border-l-4 border-[#D99B38] p-4 sm:p-5 shadow-xs">
                <p className="text-sm sm:text-base font-medium text-[#2A3127] leading-relaxed">
                  {bungalow.officialDescription}
                </p>
              </div>

              {/* Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-[#E2DFD5] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <Users className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Capacidade Oficial</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B] tabular-nums">
                    Até {bungalow.maxGuests} pessoas
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#E2DFD5] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <BedDouble className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Configuração</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B]">{bungalow.bedsSummary}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E2DFD5] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <Snowflake className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Climatização</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B]">
                    {bungalow.airConditioningNote}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#E2DFD5] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <Clock className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Check-in / Check-out</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B] tabular-nums">
                    {bungalow.checkIn} · {bungalow.checkOut}
                  </p>
                </div>
              </div>

              {/* Extended Editorial Description & Highlights */}
              <div className="bg-white rounded-2xl border border-[#E2DFD5] p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#1E261B]">Sobre o {bungalow.name}</h3>
                  <p className="mt-2 text-sm text-[#4E5A49] leading-relaxed">
                    {bungalow.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#1E261B] mb-2">Destaques da unidade</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {bungalow.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[#4E5A49]"
                      >
                        <Check
                          className="w-4 h-4 text-[#4A6B35] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: DETALHES (Exact Official Details List from riachodashortensias.tur.br) */}
          {activeTab === 'detalhes' && (
            <div className="bg-white rounded-2xl border border-[#E2DFD5] p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1E261B]">
                  Itens e Serviços do {bungalow.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6D7A67]">
                  Especificações oficiais registradas no catálogo da Pousada Rural Riacho das Hortênsias:
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bungalow.officialDetails.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F8F3] border border-[#E4EAD9] text-sm font-medium text-[#1E261B]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D99B38] shrink-0" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-[#EDF1E6]">
                <h4 className="text-sm font-bold text-[#1E261B] mb-3">
                  Comodidades e Estrutura
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {bungalow.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF2E8] text-xs sm:text-sm font-medium text-[#24361A]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                      {AMENITY_LABELS[amenity]}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF2E8] text-xs sm:text-sm font-medium text-[#24361A]">
                    <Maximize2 className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    Área aproximada: {bungalow.areaSqm} m²
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: SIMULAR ESTADIA */}
          {activeTab === 'booking' && (
            <div className="bg-white rounded-2xl border border-[#E2DFD5] p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="modal-checkin"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5A49] mb-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Check-in</span>
                  </label>
                  <input
                    id="modal-checkin"
                    type="date"
                    value={checkIn}
                    min="2026-11-24"
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl text-[#1E261B] focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="modal-checkout"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5A49] mb-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Check-out</span>
                  </label>
                  <input
                    id="modal-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn || '2026-11-25'}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl text-[#1E261B] focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="modal-guests"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5A49] mb-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Hóspedes (máx. {bungalow.maxGuests})</span>
                  </label>
                  <select
                    id="modal-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl text-[#1E261B] focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                  >
                    {Array.from({ length: bungalow.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n > 1 ? 'hóspedes' : 'hóspede'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability Status Feedback */}
              {!datesValid ? (
                <p className="text-sm text-[#8A4A1C] bg-[#FDF6EC] border border-[#F0D7B4] rounded-xl px-4 py-3">
                  Selecione uma data de check-out posterior à data de check-in para calcular a estadia.
                </p>
              ) : !datesAreFree ? (
                <p className="text-sm text-[#8A4A1C] bg-[#FDF6EC] border border-[#F0D7B4] rounded-xl px-4 py-3">
                  Este bangalô já possui reserva em parte das datas escolhidas. Experimente outra
                  data ou consulte o proprietário no chat para opções próximas.
                </p>
              ) : (
                <div className="bg-[#EFF2E8] rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-sm text-[#4E5A49]">
                    <span className="tabular-nums">
                      {formatBRL(bungalow.pricePerNight)} × {stayPricing.nights}{' '}
                      {stayPricing.nights > 1 ? 'diárias' : 'diária'}
                    </span>
                    <span className="font-semibold text-[#1E261B] tabular-nums">
                      {formatBRL(stayPricing.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#4E5A49]">
                    <span>Acesso às 2 piscinas, trilhas (60 ha) & estacionamento</span>
                    <span className="font-semibold text-[#4A6B35]">Inclusos (R$ 0)</span>
                  </div>
                  <div className="pt-2.5 border-t border-[#DFE5D6] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1E261B]">Total oficial estimado</span>
                    <span className="text-lg font-bold text-[#1E261B] tabular-nums">
                      {formatBRL(stayPricing.total)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-[#6D7A67] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4A6B35] shrink-0" aria-hidden="true" />
                  <span>Reserva direta sem intermediários e protocolo registrado no chat.</span>
                </p>
                <button
                  type="button"
                  disabled={!datesValid || !datesAreFree}
                  onClick={handleBookingInquiry}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] disabled:opacity-45 disabled:cursor-not-allowed rounded-full transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  <span>Solicitar Reserva no Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: AVALIAÇÕES */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {unitReviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2DFD5] p-6 text-center text-sm text-[#4E5A49]">
                  Ainda não há avaliações registradas para este bangalô. Seja o primeiro a avaliar!
                </div>
              ) : (
                <div className="space-y-3">
                  {unitReviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="bg-white rounded-2xl border border-[#E2DFD5] p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-[#1E261B]">{rev.authorName}</p>
                          <p className="text-xs text-[#6D7A67]">
                            {rev.authorOrigin} · {rev.stayType} ·{' '}
                            {rev.date.split('-').reverse().join('/')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#4A6B35] tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-[#4A6B35]" aria-hidden="true" />
                          <span>{rev.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="mt-2.5 text-sm text-[#4E5A49] leading-relaxed">{rev.comment}</p>
                    </article>
                  ))}
                </div>
              )}

              {/* Inline Review Form for this specific bungalow */}
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-2xl border border-[#E2DFD5] p-4 sm:p-5 space-y-3.5"
              >
                <h3 className="text-sm font-bold text-[#1E261B]">
                  Avaliar {bungalow.name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#4E5A49]">Sua nota:</span>
                  <div className="flex items-center gap-1" role="radiogroup" aria-label="Nota em estrelas">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        aria-label={`${starValue} ${starValue > 1 ? 'estrelas' : 'estrela'}`}
                        aria-pressed={rating === starValue}
                        className="p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] rounded"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starValue <= rating
                              ? 'fill-[#4A6B35] text-[#4A6B35]'
                              : 'text-[#C8D3BA]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="modal-rev-name" className="block text-xs font-medium text-[#4E5A49] mb-1">
                      Seu nome *
                    </label>
                    <input
                      id="modal-rev-name"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Ana Paula"
                      className="w-full px-3 py-2 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-rev-city" className="block text-xs font-medium text-[#4E5A49] mb-1">
                      Cidade / UF
                    </label>
                    <input
                      id="modal-rev-city"
                      type="text"
                      value={authorOrigin}
                      onChange={(e) => setAuthorOrigin(e.target.value)}
                      placeholder="Ex: Chapecó, SC"
                      className="w-full px-3 py-2 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-rev-type" className="block text-xs font-medium text-[#4E5A49] mb-1">
                      Tipo de estadia
                    </label>
                    <select
                      id="modal-rev-type"
                      value={stayType}
                      onChange={(e) => setStayType(e.target.value as Review['stayType'])}
                      className="w-full px-3 py-2 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                    >
                      <option value="Família">Família</option>
                      <option value="Casal">Casal</option>
                      <option value="Amigos">Amigos</option>
                      <option value="Individual">Individual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-rev-comment" className="block text-xs font-medium text-[#4E5A49] mb-1">
                    Comentário sobre a hospedagem *
                  </label>
                  <textarea
                    id="modal-rev-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte como foi o conforto, limpeza e contato com a natureza..."
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
                  />
                </div>

                {reviewError && <p className="text-xs font-medium text-[#A63A2B]">{reviewError}</p>}
                {reviewSuccess && (
                  <p className="text-xs font-semibold text-[#4A6B35]">
                    Avaliação publicada com sucesso! Obrigado por compartilhar sua experiência.
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer"
                >
                  Publicar Avaliação
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sticky Modal Bottom Action Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-white border-t border-[#E2DFD5] flex items-center justify-between gap-3 shrink-0">
          <div>
            <p className="text-lg font-bold text-[#1E261B] tabular-nums leading-tight">
              {formatBRL(bungalow.pricePerNight)}
              <span className="text-xs font-normal text-[#6D7A67]"> / diária oficial</span>
            </p>
            <p className="text-[11px] text-[#4A6B35] font-medium">
              {POUSADA_INFO.phones.availability} · {POUSADA_INFO.emails.reservationsRecipient}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenChatWithUnit(bungalow);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
            >
              <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Conversar com Proprietário</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Resolution Real Image Size Lightbox Overlay */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-label="Visualização em tamanho real da fotografia"
          className="fixed inset-0 z-60 bg-black/92 flex flex-col items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            e.stopPropagation();
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
        >
          <div className="w-full max-w-6xl flex items-center justify-between text-white mb-3 px-2">
            <p className="text-xs sm:text-sm font-medium truncate">
              {currentPhoto.caption} ({activePhotoIndex + 1} / {bungalow.photos.length})
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Fechar visualização em tamanho real"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center w-full max-w-6xl">
            <button
              type="button"
              onClick={handlePrevPhoto}
              aria-label="Foto anterior em tamanho real"
              className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-[#D99B38] hover:bg-[#C08526] text-white shadow-lg flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />

            <button
              type="button"
              onClick={handleNextPhoto}
              aria-label="Próxima foto em tamanho real"
              className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-[#D99B38] hover:bg-[#C08526] text-white shadow-lg flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
