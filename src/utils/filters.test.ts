import test from 'node:test';
import assert from 'node:assert/strict';
import { BUNGALOWS, INITIAL_REVIEWS } from '../data/bungalows';
import {
  DEFAULT_FILTER_STATE,
  calculateStayTotal,
  countActiveFilters,
  filterBungalows,
  generateOwnerReply,
  getAverageRating,
  isAvailableForDates,
} from './filters';

test('returns all 13 official bungalows with default filters', () => {
  const result = filterBungalows(BUNGALOWS, DEFAULT_FILTER_STATE, INITIAL_REVIEWS);
  assert.equal(result.length, 13);
});

test('filters by official price tiers (R$ 250, R$ 300-360, above R$ 360)', () => {
  const tier250 = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, priceRange: 'up-to-250' },
    INITIAL_REVIEWS
  );
  assert.equal(tier250.length, 4); // Guajuvira, Eucalipto, Tarzan, Tarumãs
  assert.ok(tier250.every((b) => b.pricePerNight === 250));

  const above360 = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, priceRange: 'above-360' },
    INITIAL_REVIEWS
  );
  assert.equal(above360.length, 3); // Angelim (420), Castanheira (420), Canafístula (600)
});

test('filters by availability and booked date conflicts', () => {
  const availableNow = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, availableOnly: true },
    INITIAL_REVIEWS
  );
  assert.equal(availableNow.length, 12);
  assert.ok(!availableNow.some((b) => b.id === 'tarumas'));

  const angelim = BUNGALOWS.find((b) => b.id === 'angelim')!;
  assert.equal(isAvailableForDates(angelim, '2026-12-04', '2026-12-06'), false);
  assert.equal(isAvailableForDates(angelim, '2026-12-08', '2026-12-10'), true);
});

test('filters by kitchen and barbecue amenities accurately', () => {
  const bbqAndKitchen = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, amenities: ['cozinha-propria', 'churrasqueira'] },
    INITIAL_REVIEWS
  );
  assert.equal(bbqAndKitchen.length, 2); // Garapeira & Canafístula
});

test('sorts by price ascending and descending across official rates (250..600)', () => {
  const asc = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, sortBy: 'price-asc' },
    INITIAL_REVIEWS
  );
  assert.equal(asc[0].pricePerNight, 250);
  assert.equal(asc[asc.length - 1].id, 'canafistula');
  assert.equal(asc[asc.length - 1].pricePerNight, 600);
});

test('calculates multi-night stay total with transparent zero hidden fees', () => {
  const stay = calculateStayTotal(250, '2026-12-10', '2026-12-13');
  assert.equal(stay.nights, 3);
  assert.equal(stay.subtotal, 750);
  assert.equal(stay.cleaningFee, 0);
  assert.equal(stay.total, 750);
});

test('aggregates average ratings and active filter count accurately', () => {
  const tarzanStats = getAverageRating(INITIAL_REVIEWS, 'tarzan');
  assert.equal(tarzanStats.count, 1);
  assert.equal(tarzanStats.average, 5);

  const count = countActiveFilters({
    ...DEFAULT_FILTER_STATE,
    zone: 'Bosque Nativo',
    availableOnly: true,
    amenities: ['ar-condicionado', 'cozinha-propria'],
  });
  assert.equal(count, 4);
});

test('generates unit-aware official owner chat replies with official rates and contacts', () => {
  const guajuvira = BUNGALOWS.find((b) => b.id === 'guajuvira')!;
  const reply = generateOwnerReply('Qual o valor da diária?', guajuvira);
  assert.ok(reply.includes('BANGALÔ GUAJUVIRA'));
  assert.ok(reply.includes('250,00'));
  assert.ok(reply.includes('99165-1222'));
});
