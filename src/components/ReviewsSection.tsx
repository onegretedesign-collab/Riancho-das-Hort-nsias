import { useState } from 'react';
import { CheckCircle2, PenLine, Star } from 'lucide-react';
import type { Bungalow, Review } from '../types/bungalow';
import { getAverageRating, getCategoryAverages } from '../utils/filters';

interface ReviewsSectionProps {
  bungalows: Bungalow[];
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'verifiedStay'>) => void;
}

export function ReviewsSection({ bungalows, reviews, onAddReview }: ReviewsSectionProps) {
  const [filterBungalowId, setFilterBungalowId] = useState<string>('all');
  const [showForm, setShowForm] = useState<boolean>(false);

  // Form states
  const [selectedUnitId, setSelectedUnitId] = useState<string>(bungalows[0]?.id || 'angelim');
  const [authorName, setAuthorName] = useState('');
  const [authorOrigin, setAuthorOrigin] = useState('');
  const [stayType, setStayType] = useState<Review['stayType']>('Família');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState('');

  const filteredReviews =
    filterBungalowId === 'all'
      ? reviews
      : reviews.filter((r) => r.bungalowId === filterBungalowId);

  const overallStats = getAverageRating(reviews);
  const categoryStats = getCategoryAverages(filteredReviews.length ? filteredReviews : reviews);

  const bungalowNameById = new Map(bungalows.map((b) => [b.id, b.name]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setErrorMsg('Informe seu nome e escreva um comentário sobre sua hospedagem.');
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMsg('Seu comentário deve ter pelo menos 10 caracteres.');
      return;
    }

    onAddReview({
      bungalowId: selectedUnitId,
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
    setErrorMsg('');
    setSubmittedMsg('Avaliação registrada com sucesso!');
    setFilterBungalowId(selectedUnitId);
    setShowForm(false);
  };

  return (
    <section id="avaliacoes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-[#4A6B35]">
            Transparência verificada · Experiências reais
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E261B] mt-1">
            Avaliações dos <span className="text-[#4A6B35]">Hóspedes</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setSubmittedMsg('');
          }}
          aria-expanded={showForm}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap"
        >
          <PenLine className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{showForm ? 'Fechar Formulário' : 'Escrever Avaliação'}</span>
        </button>
      </div>

      {/* Aggregate Score & Category Breakdown */}
      <div className="bg-white rounded-3xl border border-[#DFE5D6] p-6 sm:p-8 mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 lg:border-r border-[#EDF1E6] lg:pr-6">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl font-bold text-[#1E261B] tabular-nums">
              {overallStats.average.toFixed(1)}
            </span>
            <div>
              <div className="flex items-center gap-0.5 text-[#4A6B35]" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#4A6B35]" />
                ))}
              </div>
              <p className="text-xs text-[#6D7A67] mt-1 tabular-nums">
                Baseado em {overallStats.count} avaliações verificadas
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
          {(
            [
              { label: 'Limpeza e conservação', value: categoryStats.cleanliness },
              { label: 'Conforto dos bangalôs', value: categoryStats.comfort },
              { label: 'Contato com a natureza', value: categoryStats.location },
              { label: 'Atendimento dos proprietários', value: categoryStats.hospitality },
            ] as const
          ).map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between text-xs font-semibold text-[#4E5A49] mb-1.5">
                <span>{metric.label}</span>
                <span className="text-[#1E261B] tabular-nums">{metric.value.toFixed(1)} / 5</span>
              </div>
              <div className="h-2 bg-[#EFF2E8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4A6B35] rounded-full"
                  style={{ width: `${(metric.value / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {submittedMsg && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 px-4 py-3 bg-[#EFF2E8] border border-[#4A6B35]/30 rounded-2xl text-sm font-semibold text-[#24361A]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#4A6B35] shrink-0" aria-hidden="true" />
          <span>{submittedMsg}</span>
        </div>
      )}

      {/* Expandable Add Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          aria-label="Formulário para enviar avaliação de hospedagem"
          className="mb-8 bg-white rounded-3xl border border-[#4A6B35]/40 p-6 shadow-sm space-y-4"
        >
          <h3 className="text-lg font-bold text-[#1E261B]">Compartilhe sua estadia</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="rev-bungalow"
                className="block text-xs font-semibold text-[#4E5A49] mb-1.5"
              >
                Bangalô hospedado
              </label>
              <select
                id="rev-bungalow"
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
              >
                {bungalows.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="rev-author"
                className="block text-xs font-semibold text-[#4E5A49] mb-1.5"
              >
                Seu nome *
              </label>
              <input
                id="rev-author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: Lucas & Beatriz"
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-origin"
                className="block text-xs font-semibold text-[#4E5A49] mb-1.5"
              >
                Cidade / Estado
              </label>
              <input
                id="rev-origin"
                type="text"
                value={authorOrigin}
                onChange={(e) => setAuthorOrigin(e.target.value)}
                placeholder="Ex: Florianópolis, SC"
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-stay-type"
                className="block text-xs font-semibold text-[#4E5A49] mb-1.5"
              >
                Perfil da viagem
              </label>
              <select
                id="rev-stay-type"
                value={stayType}
                onChange={(e) => setStayType(e.target.value as Review['stayType'])}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
              >
                <option value="Família">Família</option>
                <option value="Casal">Casal</option>
                <option value="Amigos">Amigos</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-[#4E5A49]">Avaliação geral:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Dar nota ${star}`}
                  aria-pressed={rating === star}
                  className="p-1 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-[#4A6B35] text-[#4A6B35]' : 'text-[#C8D3BA]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="rev-comment"
              className="block text-xs font-semibold text-[#4E5A49] mb-1.5"
            >
              Seu relato *
            </label>
            <textarea
              id="rev-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva o que mais gostou na acomodação e na pousada..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
            />
          </div>

          {errorMsg && <p className="text-xs font-semibold text-[#A63A2B]">{errorMsg}</p>}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-[#4E5A49] hover:text-[#1E261B] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors cursor-pointer"
            >
              Enviar Avaliação
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs by Bungalow */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <button
          type="button"
          onClick={() => setFilterBungalowId('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            filterBungalowId === 'all'
              ? 'bg-[#4A6B35] text-white'
              : 'bg-white border border-[#DFE5D6] text-[#4E5A49] hover:text-[#1E261B]'
          }`}
        >
          Todos ({reviews.length})
        </button>
        {bungalows.map((unit) => {
          const count = reviews.filter((r) => r.bungalowId === unit.id).length;
          return (
            <button
              key={unit.id}
              type="button"
              onClick={() => setFilterBungalowId(unit.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterBungalowId === unit.id
                  ? 'bg-[#4A6B35] text-white'
                  : 'bg-white border border-[#DFE5D6] text-[#4E5A49] hover:text-[#1E261B]'
              }`}
            >
              {unit.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReviews.map((review) => (
          <article
            key={review.id}
            className="bg-white rounded-2xl border border-[#E4EAD9] p-5 flex flex-col justify-between gap-4 shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1E261B]">{review.authorName}</h3>
                  <p className="text-xs text-[#6D7A67] mt-0.5">
                    {review.authorOrigin} · {review.stayType}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#4A6B35] tabular-nums shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#4A6B35]" aria-hidden="true" />
                  <span>{review.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-3 text-sm text-[#4E5A49] leading-relaxed">"{review.comment}"</p>
            </div>

            <div className="pt-3 border-t border-[#EDF1E6] flex items-center justify-between text-xs text-[#6D7A67]">
              <span className="font-semibold text-[#4A6B35]">
                {bungalowNameById.get(review.bungalowId) || 'Pousada'}
              </span>
              <span className="tabular-nums">{review.date.split('-').reverse().join('/')}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
