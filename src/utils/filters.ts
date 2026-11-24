import type { Bungalow, FilterState, Review } from '../types/bungalow';

export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  zone: 'all',
  priceRange: 'all',
  maxPrice: 500,
  minGuests: 1,
  availableOnly: false,
  checkIn: '',
  checkOut: '',
  amenities: [],
  sortBy: 'featured',
};

/**
 * Checks whether a bungalow is free across a [checkIn, checkOut) date range.
 * Dates are ISO strings in YYYY-MM-DD format.
 */
export function isAvailableForDates(
  bungalow: Bungalow,
  checkIn: string,
  checkOut: string
): boolean {
  if (!checkIn) {
    return true;
  }

  const start = new Date(`${checkIn}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) {
    return true;
  }

  const end = checkOut
    ? new Date(`${checkOut}T00:00:00Z`)
    : new Date(start.getTime() + 86400000);

  if (Number.isNaN(end.getTime()) || end <= start) {
    return !bungalow.bookedDates.includes(checkIn);
  }

  const bookedSet = new Set(bungalow.bookedDates);
  const cursor = new Date(start);
  while (cursor < end) {
    const iso = cursor.toISOString().slice(0, 10);
    if (bookedSet.has(iso)) {
      return false;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return true;
}

/**
 * Calculates number of nights and total stay price cleanly with transparent breakdown.
 */
export function calculateStayTotal(
  pricePerNight: number,
  checkIn: string,
  checkOut: string
): { nights: number; subtotal: number; cleaningFee: number; total: number } {
  let nights = 1;
  if (checkIn && checkOut) {
    const start = new Date(`${checkIn}T00:00:00Z`);
    const end = new Date(`${checkOut}T00:00:00Z`);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
      nights = Math.round((end.getTime() - start.getTime()) / 86400000);
    }
  }
  const subtotal = pricePerNight * nights;
  // Transparent policy: zero hidden fees at Pousada Rural Riacho das Hortênsias
  const cleaningFee = 0;
  return {
    nights,
    subtotal,
    cleaningFee,
    total: subtotal + cleaningFee,
  };
}

/**
 * Computes average rating for a bungalow (or across all reviews if bungalowId is omitted).
 */
export function getAverageRating(reviews: Review[], bungalowId?: string): {
  average: number;
  count: number;
} {
  const subset = bungalowId ? reviews.filter((r) => r.bungalowId === bungalowId) : reviews;
  if (subset.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = subset.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Number((sum / subset.length).toFixed(1)),
    count: subset.length,
  };
}

/**
 * Computes category rating breakdown across a set of reviews.
 */
export function getCategoryAverages(reviews: Review[]) {
  if (reviews.length === 0) {
    return { cleanliness: 0, comfort: 0, location: 0, hospitality: 0 };
  }
  const count = reviews.length;
  return {
    cleanliness: Number(
      (reviews.reduce((s, r) => s + r.cleanliness, 0) / count).toFixed(1)
    ),
    comfort: Number((reviews.reduce((s, r) => s + r.comfort, 0) / count).toFixed(1)),
    location: Number((reviews.reduce((s, r) => s + r.location, 0) / count).toFixed(1)),
    hospitality: Number(
      (reviews.reduce((s, r) => s + r.hospitality, 0) / count).toFixed(1)
    ),
  };
}

/**
 * Filters and sorts bungalows based on active search, price, availability, dates, and amenities.
 */
export function filterBungalows(
  bungalows: Bungalow[],
  filters: FilterState,
  reviews: Review[]
): Bungalow[] {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  const matched = bungalows.filter((unit) => {
    if (normalizedQuery) {
      const haystack =
        `${unit.name} ${unit.shortTagline} ${unit.zone} ${unit.style} ${unit.description}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    if (filters.zone !== 'all' && unit.zone !== filters.zone) {
      return false;
    }

    if (filters.priceRange === 'up-to-320' && unit.pricePerNight > 320) {
      return false;
    }
    if (
      filters.priceRange === '320-to-400' &&
      (unit.pricePerNight < 320 || unit.pricePerNight > 400)
    ) {
      return false;
    }
    if (filters.priceRange === 'above-400' && unit.pricePerNight <= 400) {
      return false;
    }

    if (unit.pricePerNight > filters.maxPrice) {
      return false;
    }

    if (unit.maxGuests < filters.minGuests) {
      return false;
    }

    if (filters.availableOnly && !unit.availableNow) {
      return false;
    }

    if (filters.checkIn && !isAvailableForDates(unit, filters.checkIn, filters.checkOut)) {
      return false;
    }

    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((a) => unit.amenities.includes(a));
      if (!hasAll) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...matched];
  switch (filters.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case 'capacity-desc':
      sorted.sort((a, b) => b.maxGuests - a.maxGuests);
      break;
    case 'rating-desc':
      sorted.sort(
        (a, b) =>
          getAverageRating(reviews, b.id).average - getAverageRating(reviews, a.id).average
      );
      break;
    case 'featured':
    default:
      break;
  }

  return sorted;
}

/**
 * Counts how many non-default filters are currently active.
 */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.searchQuery.trim()) count += 1;
  if (filters.zone !== 'all') count += 1;
  if (filters.priceRange !== 'all') count += 1;
  if (filters.maxPrice < 500) count += 1;
  if (filters.minGuests > 1) count += 1;
  if (filters.availableOnly) count += 1;
  if (filters.checkIn) count += 1;
  count += filters.amenities.length;
  return count;
}

/**
 * Formats BRL currency cleanly.
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Generates a transparent, unit-aware owner response for the integrated chat.
 */
export function generateOwnerReply(userText: string, unit: Bungalow | null): string {
  const lower = userText.toLowerCase();
  const unitLabel = unit ? unit.name : 'nossos bangalôs';

  if (lower.includes('pet') || lower.includes('cachorro') || lower.includes('animal')) {
    if (unit) {
      return unit.amenities.includes('pet-friendly')
        ? `Sim! O ${unit.name} é Pet Friendly e recebe cães de pequeno e médio porte sem taxa extra. Temos ampla área verde em Linha Bela Vista para passeios.`
        : `No ${unit.name} priorizamos hóspedes sem pets por conta da estrutura elevada, mas nossos bangalôs Itaúba, Pequi, Tarumãs e Eucalipto são 100% Pet Friendly! Quer ver detalhes de algum deles?`;
    }
    return 'Aceitamos pets de pequeno e médio porte sem taxa adicional nos bangalôs Itaúba, Pequi, Tarumãs e Eucalipto!';
  }

  if (lower.includes('café') || lower.includes('cafe') || lower.includes('alimentação')) {
    return `O café colonial rural já está 100% incluso na diária de ${unitLabel}, servido diariamente das 07h30 às 10h00 com pães caseiros, queijos da região, frutas e bolos feitos na pousada.`;
  }

  if (
    lower.includes('pagamento') ||
    lower.includes('seguro') ||
    lower.includes('pix') ||
    lower.includes('cancel') ||
    lower.includes('taxa')
  ) {
    return 'Trabalhamos com total transparência: zero taxas ocultas ou de limpeza. A confirmação é feita diretamente com a Pousada Riacho das Hortênsias via Pix (30% de sinal com recibo oficial) e o restante no check-in, com cancelamento gratuito até 7 dias antes.';
  }

  if (
    lower.includes('preço') ||
    lower.includes('valor') ||
    lower.includes('diária') ||
    lower.includes('diaria') ||
    lower.includes('fim de semana') ||
    lower.includes('reserva')
  ) {
    if (unit) {
      const availText = unit.availableNow
        ? 'está disponível para reserva imediata'
        : `tem próxima disponibilidade a partir de ${unit.nextAvailableDate.split('-').reverse().join('/')}`;
      return `O ${unit.name} tem diária transparente de ${formatBRL(unit.pricePerNight)} (para até ${unit.maxGuests} hóspedes, café colonial incluso, sem taxa de limpeza) e ${availText}. Informe as datas desejadas para gerarmos seu pré-contrato oficial por aqui.`;
    }
    return 'Nossas diárias variam de R$ 295 a R$ 460 com café colonial incluso e zero taxas escondidas. Me diga as datas e quantas pessoas virão para eu indicar o melhor bangalô!';
  }

  if (unit) {
    return `Olá! Obrigado pela mensagem sobre o ${unit.name}. Ele acomoda até ${unit.maxGuests} hóspedes (${unit.bedsSummary}), fica na área ${unit.zone} e tem diária de ${formatBRL(unit.pricePerNight)} com café colonial incluso. Como posso ajudar a planejar sua estadia em Santa Helena - SC?`;
  }

  return 'Olá! Seja muito bem-vindo à Pousada Rural Riacho das Hortênsias (Santa Helena - SC). Toda negociação aqui fica registrada com protocolo para sua segurança. Qual bangalô ou data você gostaria de consultar?';
}
