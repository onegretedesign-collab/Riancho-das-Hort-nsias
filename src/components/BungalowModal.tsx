import { useEffect, useState } from 'react';
import {
  BedDouble,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Maximize2,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import { AMENITY_LABELS } from '../data/bungalows';
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

type ModalTab = 'overview' | 'booking' | 'reviews';

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
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [checkIn, setCheckIn] = useState(initialCheckIn || '2026-12-08');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '2026-12-10');
  const [guests, setGuests] = useState(2);

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
    setActiveTab('overview');
    setGuests(Math.min(2, bungalow.maxGuests));
    setReviewError('');
    setReviewSuccess(false);
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
  }, [bungalow, initialCheckIn, initialCheckOut]);

  useEffect(() => {
    if (!bungalow) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [bungalow, onClose]);

  if (!bungalow) return null;

  const unitReviews = reviews.filter((r) => r.bungalowId === bungalow.id);
  const { average, count } = getAverageRating(reviews, bungalow.id);
  const currentPhoto = bungalow.photos[activePhotoIndex] || bungalow.photos[0];
  const stayPricing = calculateStayTotal(bungalow.pricePerNight, checkIn, checkOut);
  const datesAreFree = isAvailableForDates(bungalow, checkIn, checkOut);
  const datesValid = Boolean(checkIn && checkOut && checkOut > checkIn);

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-[#182613]/65 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-[#F7F8F3] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DFE5D6] flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-white border-b border-[#E4EAD9] shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <h2
                id="bungalow-modal-title"
                className="font-display text-xl sm:text-2xl font-semibold text-[#1E261B] truncate"
              >
                {bungalow.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6B35] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#4A6B35]" aria-hidden="true" />
                {average > 0 ? average.toFixed(1) : 'Novo'} ({count})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6D7A67] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#4A6B35] shrink-0" aria-hidden="true" />
              <span>
                {bungalow.zone} · Linha Bela Vista, Santa Helena - SC
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
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 space-y-5">
          {/* Interactive Multi-Photo Gallery */}
          <div className="bg-white rounded-2xl border border-[#E4EAD9] p-3 sm:p-4">
            <div className="relative h-[240px] sm:h-[330px] rounded-xl overflow-hidden bg-[#24361A] flex items-center justify-center">
              {/* Soft blurred ambient backdrop eliminates harsh dark letterbox bars */}
              <img
                src={currentPhoto.url}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#1B2A15]/35"
              />
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                referrerPolicy="no-referrer"
                className="relative z-10 h-full w-auto max-w-full object-contain shadow-lg"
              />

              {/* Previous / Next Controls */}
              <button
                type="button"
                onClick={() =>
                  setActivePhotoIndex(
                    (prev) => (prev - 1 + bungalow.photos.length) % bungalow.photos.length
                  )
                }
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/92 hover:bg-white text-[#1E261B] shadow-md flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev + 1) % bungalow.photos.length)
                }
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/92 hover:bg-white text-[#1E261B] shadow-md flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Photo Counter */}
              <span className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-[#1E261B]/80 backdrop-blur-sm text-white text-xs font-semibold tabular-nums">
                {activePhotoIndex + 1} / {bungalow.photos.length}
              </span>
            </div>

            {/* Active Photo Caption */}
            <p className="mt-2.5 text-xs sm:text-sm text-[#4E5A49] font-medium px-1">
              {currentPhoto.caption}
            </p>

            {/* Thumbnail Strip (All Specific Unit Photos) */}
            <div
              role="list"
              aria-label={`Galeria de fotos de ${bungalow.name}`}
              className="mt-3 flex gap-2.5 overflow-x-auto pb-1"
            >
              {bungalow.photos.map((photo, index) => {
                const isSelected = index === activePhotoIndex;
                return (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => setActivePhotoIndex(index)}
                    aria-label={`Ver foto ${index + 1}: ${photo.caption}`}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`relative shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] ${
                      isSelected
                        ? 'border-[#4A6B35] opacity-100 ring-2 ring-[#4A6B35]/25'
                        : 'border-transparent opacity-70 hover:opacity-100'
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
          </div>

          {/* Modal Segmented Tabs */}
          <div
            role="tablist"
            aria-label="Seções de detalhes do bangalô"
            className="flex items-center gap-1 p-1 bg-[#EFF2E8] rounded-xl border border-[#DFE5D6]"
          >
            {(
              [
                { id: 'overview', label: 'Visão Geral' },
                { id: 'booking', label: 'Simular Estadia' },
                { id: 'reviews', label: `Avaliações (${unitReviews.length})` },
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
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-[#1E261B] shadow-sm'
                      : 'text-[#4E5A49] hover:text-[#1E261B]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-[#E4EAD9] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <Users className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Capacidade</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B] tabular-nums">
                    Até {bungalow.maxGuests} hóspedes
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#E4EAD9] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <BedDouble className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Acomodação</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B]">{bungalow.bedsSummary}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E4EAD9] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <Maximize2 className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Área interna</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B] tabular-nums">
                    {bungalow.areaSqm} m²
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#E4EAD9] p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6D7A67]">
                    <Clock className="w-3.5 h-3.5 text-[#4A6B35]" aria-hidden="true" />
                    <span>Horários</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#1E261B] tabular-nums">
                    {bungalow.checkIn} · {bungalow.checkOut}
                  </p>
                </div>
              </div>

              {/* Description & Highlights */}
              <div className="bg-white rounded-2xl border border-[#E4EAD9] p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#1E261B]">Sobre esta acomodação</h3>
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

                <div className="pt-3 border-t border-[#EDF1E6]">
                  <h4 className="text-sm font-bold text-[#1E261B] mb-2.5">
                    Comodidades incluídas
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#4E5A49]">
                    {bungalow.amenities.map((amenity) => (
                      <span key={amenity} className="inline-flex items-center gap-1.5">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#4A6B35] shrink-0"
                          aria-hidden="true"
                        />
                        {AMENITY_LABELS[amenity]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Stay Calculator & Booking Request */}
          {activeTab === 'booking' && (
            <div className="bg-white rounded-2xl border border-[#E4EAD9] p-5 space-y-5">
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
                    <span>Café colonial rural & taxa de limpeza</span>
                    <span className="font-semibold text-[#4A6B35]">Inclusos (R$ 0)</span>
                  </div>
                  <div className="pt-2.5 border-t border-[#DFE5D6] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1E261B]">Total transparente</span>
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

          {/* Tab 3: Unit-Specific Guest Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {unitReviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E4EAD9] p-6 text-center text-sm text-[#4E5A49]">
                  Ainda não há avaliações registradas para este bangalô. Seja o primeiro a avaliar!
                </div>
              ) : (
                <div className="space-y-3">
                  {unitReviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="bg-white rounded-2xl border border-[#E4EAD9] p-4"
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
                className="bg-white rounded-2xl border border-[#E4EAD9] p-4 sm:p-5 space-y-3.5"
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
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-[#E4EAD9] flex items-center justify-between gap-3 shrink-0">
          <div>
            <p className="text-lg font-bold text-[#1E261B] tabular-nums leading-tight">
              {formatBRL(bungalow.pricePerNight)}
              <span className="text-xs font-normal text-[#6D7A67]"> / noite</span>
            </p>
            <p className="text-[11px] text-[#4A6B35] font-medium">
              Café colonial incluso · Sem taxas ocultas
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
    </div>
  );
}
