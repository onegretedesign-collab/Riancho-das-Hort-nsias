import { Instagram, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';

interface FooterProps {
  onOpenChat: () => void;
}

export function Footer({ onOpenChat }: FooterProps) {
  return (
    <footer className="mt-10 bg-[#24361A] text-[#E6EFE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Description */}
        <div className="md:col-span-5 space-y-3">
          <p className="font-display text-2xl font-semibold text-white">
            {POUSADA_INFO.name}
          </p>
          <p className="text-sm text-[#CBD9C2] leading-relaxed max-w-md">
            {POUSADA_INFO.tagline}
          </p>
          <button
            type="button"
            onClick={onOpenChat}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E261B] bg-[#A3D96C] hover:bg-[#93CA5B] rounded-full transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            <span>Iniciar Conversa Direta</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="md:col-span-3 space-y-2.5 text-sm">
          <h3 className="font-semibold text-white">Navegação</h3>
          <ul className="space-y-2 text-[#CBD9C2]">
            <li>
              <a href="#inicio" className="hover:text-white transition-colors">
                Início
              </a>
            </li>
            <li>
              <a href="#bangalos" className="hover:text-white transition-colors">
                Catálogo de Bangalôs
              </a>
            </li>
            <li>
              <a href="#mapa" className="hover:text-white transition-colors">
                Mapa Interativo
              </a>
            </li>
            <li>
              <a href="#avaliacoes" className="hover:text-white transition-colors">
                Avaliações dos Hóspedes
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-white transition-colors">
                Sobre a Pousada
              </a>
            </li>
          </ul>
        </div>

        {/* Official Contact from Catalog */}
        <div className="md:col-span-4 space-y-2.5 text-sm">
          <h3 className="font-semibold text-white">Contato & Localização</h3>
          <ul className="space-y-2.5 text-[#CBD9C2]">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#A3D96C] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {POUSADA_INFO.address} · CEP {POUSADA_INFO.cep}
              </span>
            </li>
            <li className="flex items-center gap-2 tabular-nums">
              <Phone className="w-4 h-4 text-[#A3D96C] shrink-0" aria-hidden="true" />
              <span>
                {POUSADA_INFO.phones[0]} · {POUSADA_INFO.phones[1]}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A3D96C] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${POUSADA_INFO.email}`}
                className="hover:text-white transition-colors break-all"
              >
                {POUSADA_INFO.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-[#A3D96C] shrink-0" aria-hidden="true" />
              <span>{POUSADA_INFO.instagram}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#B5C6AA]">
          <p>
            © {new Date().getFullYear()} Pousada Rural {POUSADA_INFO.name}. Todos os direitos
            reservados.
          </p>
          <p>{POUSADA_INFO.website}</p>
        </div>
      </div>
    </footer>
  );
}
