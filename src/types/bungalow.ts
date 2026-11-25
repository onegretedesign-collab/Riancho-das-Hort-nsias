export type AmenityId =
  | 'ar-condicionado'
  | 'cozinha-propria'
  | 'churrasqueira'
  | 'varanda-privativa'
  | 'servico-quarto'
  | 'agua-quente-fria'
  | 'roupa-cama-toalhas'
  | 'vista-mata'
  | 'estacionamento'
  | 'casa-na-arvore';

export type EstateZone =
  | 'Bosque Nativo'
  | 'Encosta das Pedras'
  | 'Margem do Riacho'
  | 'Copa das Árvores'
  | 'Área das Piscinas'
  | 'Mirante da Serra';

export interface BungalowPhoto {
  url: string;
  caption: string;
}

export interface HeroBannerSlide {
  id: string;
  imageUrl: string;
  kicker: string;
  title: string;
  highlight: string;
  subtitle: string;
  bungalowId?: string;
  priceLabel?: string;
}

export interface PousadaService {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  contactNote?: string;
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
  hasAirConditioning: boolean;
  airConditioningNote: string;
  availableNow: boolean;
  nextAvailableDate: string; // YYYY-MM-DD
  bookedDates: string[]; // YYYY-MM-DD dates already reserved
  amenities: AmenityId[];
  officialDescription: string;
  officialDetails: string[];
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
  date: string;
  rating: number;
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
  zone: string;
  priceRange: 'all' | 'up-to-250' | '251-to-360' | 'above-360';
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

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  destinationEmail: string;
  protocolCode: string;
  createdAt: string;
}
