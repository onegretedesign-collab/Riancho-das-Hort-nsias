import type { Bungalow, FilterState, Review } from '../types/bungalow';

export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  zone: 'all',
  priceRange: 'all',
  maxPrice: 600,
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
    return { average: 4.9, count: 1 };
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
    return { cleanliness: 5, comfort: 4.9, location: 5, hospitality: 5 };
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
        `${unit.name} ${unit.shortTagline} ${unit.zone} ${unit.style} ${unit.officialDescription} ${unit.description}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    if (filters.zone !== 'all' && unit.zone !== filters.zone) {
      return false;
    }

    if (filters.priceRange === 'up-to-250' && unit.pricePerNight > 250) {
      return false;
    }
    if (
      filters.priceRange === '251-to-360' &&
      (unit.pricePerNight <= 250 || unit.pricePerNight > 360)
    ) {
      return false;
    }
    if (filters.priceRange === 'above-360' && unit.pricePerNight <= 360) {
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
  if (filters.maxPrice < 600) count += 1;
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

  if (
    lower.includes('cozinha') ||
    lower.includes('churrasqueira') ||
    lower.includes('churrasco')
  ) {
    if (unit) {
      const hasK = unit.amenities.includes('cozinha-propria');
      const hasB = unit.amenities.includes('churrasqueira');
      if (hasK && hasB) {
        return `Sim! O ${unit.name} possui cozinha própria equipada e churrasqueira privativa (${unit.officialDescription}).`;
      }
      if (hasK) {
        return `Sim! O ${unit.name} possui cozinha própria/vinculada (${unit.officialDescription}). Para churrasqueira privativa também temos os bangalôs Garapeira e Canafístula.`;
      }
      return `O ${unit.name} conta com nosso Restaurante completo (café da manhã, almoço e janta com Daniel no +55 65 98466-8000). Se preferir cozinha própria, indicamos os bangalôs Angelim, Castanheira, Garapeira, Araucária, Casa do Tarzan ou Canafístula!`;
    }
    return 'Nossos bangalôs Angelim, Castanheira, Garapeira, Araucária, Casa do Tarzan e Canafístula possuem cozinha própria, e os bangalôs Garapeira e Canafístula também contam com churrasqueira privativa!';
  }

  if (
    lower.includes('restaurante') ||
    lower.includes('café') ||
    lower.includes('cafe') ||
    lower.includes('almoço') ||
    lower.includes('janta')
  ) {
    return 'Nosso restaurante serve refeições completas de café da manhã, almoço e janta! Para agendar refeições ou consultar o cardápio do dia, você pode falar diretamente aqui ou com o Daniel pelo +55 (65) 98466-8000.';
  }

  if (
    lower.includes('contato') ||
    lower.includes('telefone') ||
    lower.includes('email') ||
    lower.includes('e-mail') ||
    lower.includes('cnpj')
  ) {
    return 'Nossos canais oficiais da Pousada Rural Riacho das Hortênsias Ltda (CNPJ 35.910.768/0001-87) são: Consultar Disponibilidade +55 (49) 99165-1222, Central de Reservas +55 (49) 99191-5297, Atendimento/Restaurante +55 (65) 98466-8000, e-mails reservas@riachodashortensias.com.br e riachodashortensias@gmail.com.';
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
      return `${unit.officialDescription} — Inclui serviço de quarto, água quente/fria, roupa de cama, toalhas e artigos de toalete. Você pode confirmar pelo chat, pelo e-mail reservas@riachodashortensias.com.br ou pelo WhatsApp +55 (49) 99165-1222.`;
    }
    return 'Nossas diárias oficiais são: R$ 250,00 (Guajuvira, Eucalipto, Tarumãs e Casa do Tarzan), R$ 300,00 (Jatobá), R$ 360,00 (Itaúba, Pequi, Grápia, Garapeira e Araucária), R$ 420,00 (Angelim e Castanheira) e R$ 600,00 (Canafístula para até 10 pessoas).';
  }

  if (unit) {
    return `Olá! Sobre o ${unit.name}: ${unit.officialDescription}. Todas as unidades incluem serviço de quarto, roupa de cama, toalhas, água mineral e acesso às duas piscinas e aos 60 hectares de trilhas. Como posso ajudar com sua reserva?`;
  }

  return 'Olá! Seja bem-vindo à Pousada Rural Riacho das Hortênsias Ltda (Bela Vista interior, Santa Helena - SC · CNPJ 35.910.768/0001-87). Qual dos nossos 13 bangalôs ou datas você gostaria de consultar?';
}
