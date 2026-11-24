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

test('returns all 8 catalog bungalows with default filters', () => {
  const result = filterBungalows(BUNGALOWS, DEFAULT_FILTER_STATE, INITIAL_REVIEWS);
  assert.equal(result.length, 8);
});

test('filters by price range and maxPrice slider accurately', () => {
  const under320 = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, priceRange: 'up-to-320' },
    INITIAL_REVIEWS
  );
  assert.ok(under320.length > 0);
  assert.ok(under320.every((b) => b.pricePerNight <= 320));

  const max350 = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, maxPrice: 350 },
    INITIAL_REVIEWS
  );
  assert.ok(max350.every((b) => b.pricePerNight <= 350));
});

test('filters by availability and booked date conflicts', () => {
  const availableNow = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, availableOnly: true },
    INITIAL_REVIEWS
  );
  assert.equal(availableNow.length, 7);
  assert.ok(!availableNow.some((b) => b.id === 'tarumas'));

  const angelim = BUNGALOWS.find((b) => b.id === 'angelim')!;
  assert.equal(isAvailableForDates(angelim, '2026-12-04', '2026-12-06'), false);
  assert.equal(isAvailableForDates(angelim, '2026-12-08', '2026-12-10'), true);
});

test('filters by multiple amenities (AND logic)', () => {
  const poolAndPet = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, amenities: ['vista-piscina', 'pet-friendly'] },
    INITIAL_REVIEWS
  );
  assert.equal(poolAndPet.length, 1);
  assert.equal(poolAndPet[0].id, 'eucalipto');
});

test('sorts by price ascending and descending', () => {
  const asc = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, sortBy: 'price-asc' },
    INITIAL_REVIEWS
  );
  assert.equal(asc[0].id, 'itauba');
  assert.equal(asc[asc.length - 1].id, 'tarzan');

  const desc = filterBungalows(
    BUNGALOWS,
    { ...DEFAULT_FILTER_STATE, sortBy: 'price-desc' },
    INITIAL_REVIEWS
  );
  assert.equal(desc[0].id, 'tarzan');
});

test('calculates multi-night stay total with transparent zero hidden fees', () => {
  const stay = calculateStayTotal(360, '2026-12-10', '2026-12-13');
  assert.equal(stay.nights, 3);
  assert.equal(stay.subtotal, 1080);
  assert.equal(stay.cleaningFee, 0);
  assert.equal(stay.total, 1080);
});

test('aggregates average ratings and active filter count accurately', () => {
  const tarzanStats = getAverageRating(INITIAL_REVIEWS, 'tarzan');
  assert.equal(tarzanStats.count, 1);
  assert.equal(tarzanStats.average, 5);

  const count = countActiveFilters({
    ...DEFAULT_FILTER_STATE,
    zone: 'Bosque Nativo',
    availableOnly: true,
    amenities: ['ar-condicionado', 'pet-friendly'],
  });
  assert.equal(count, 4);
});

test('generates unit-aware transparent owner chat replies', () => {
  const tarzan = BUNGALOWS.find((b) => b.id === 'tarzan')!;
  const reply = generateOwnerReply('Qual o valor da diária?', tarzan);
  assert.ok(reply.includes('Casa do Tarzan'));
  assert.ok(reply.includes('460'));

  const petReply = generateOwnerReply('Aceita cachorro?', tarzan);
  assert.ok(petReply.includes('Itaúba'));
});
