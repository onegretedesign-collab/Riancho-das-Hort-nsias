export type AmenityId =
  | 'ar-condicionado'
  | 'varanda-privativa'
  | 'wifi-rural'
  | 'cafe-colonial'
  | 'vista-piscina'
  | 'vista-mata'
  | 'estacionamento'
  | 'pet-friendly'
  | 'mesa-refeicoes'
  | 'casa-na-arvore';

export type EstateZone =
  | 'Encosta das Pedras'
  | 'Bosque Nativo'
  | 'Margem do Riacho'
  | 'Copa das Árvores'
  | 'Área da Piscina';

export interface BungalowPhoto {
  url: string;
  caption: string;
}

export interface Bungalow {
  id: string;
  slug: string;
  name: string;
  shortTagline: string;
  zone: EstateZone;
  style: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  bedsSummary: string;
  availableNow: boolean;
  nextAvailableDate: string; // YYYY-MM-DD
  bookedDates: string[]; // YYYY-MM-DD dates already reserved
  amenities: AmenityId[];
  description: string;
  highlights: string[];
  photos: BungalowPhoto[];
  mapPosition: {
    x: number; // percentage 0..100 on estate map
    y: number; // percentage 0..100 on estate map
    distanceToPoolM: number;
    distanceToStreamM: number;
    distanceToReceptionM: number;
  };
  checkIn: string;
  checkOut: string;
}

export interface Review {
  id: string;
  bungalowId: string;
  authorName: string;
  authorOrigin: string;
  stayType: 'Família' | 'Casal' | 'Amigos' | 'Individual';
  date: string; // e.g. '2026-10-18'
  rating: number; // 1..5
  cleanliness: number;
  comfort: number;
  location: number;
  hospitality: number;
  comment: string;
  verifiedStay: boolean;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'capacity-desc';

export interface FilterState {
  searchQuery: string;
  zone: string; // 'all' or EstateZone
  priceRange: 'all' | 'up-to-320' | '320-to-400' | 'above-400';
  maxPrice: number;
  minGuests: number;
  availableOnly: boolean;
  checkIn: string;
  checkOut: string;
  amenities: AmenityId[];
  sortBy: SortOption;
}

export interface ChatMessage {
  id: string;
  sender: 'guest' | 'owner' | 'system';
  text: string;
  timestamp: string;
  bungalowId?: string;
  protocolCode?: string;
}
