import { Instagram, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';

interface FooterProps {
  onOpenChat: () => void;
}

export function Footer({ onOpenChat }: FooterProps) {
  return (
    <footer className="mt-10 bg-[#24361A] text-[#E6EFE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Official White SVG Logo & Brand Description */}
        <div className="md:col-span-5 space-y-3.5">
          <div className="flex items-center gap-3">
            <img
              src={POUSADA_INFO.logos.light}
              alt="Logo oficial Pousada Rural Riacho das Hortênsias"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-[#CBD9C2] leading-relaxed max-w-md">
            {POUSADA_INFO.tagline}
          </p>
          <p className="text-xs text-[#A9BE9D] font-medium">
            {POUSADA_INFO.legalName} · CNPJ: {POUSADA_INFO.cnpj}
          </p>
          <button
            type="button"
            onClick={onOpenChat}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E261B] bg-[#A3D96C] hover:bg-[#93CA5B] rounded-full transition-colors cursor-pointer"
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
                13 Bangalôs Oficiais
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-white transition-colors">
                História & Estrutura
              </a>
            </li>
            <li>
              <a href="#mapa" className="hover:text-white transition-colors">
                Mapa das Unidades
              </a>
            </li>
            <li>
              <a href="#avaliacoes" className="hover:text-white transition-colors">
                Avaliações dos Hóspedes
              </a>
            </li>
            <li>
              <a href="#contato" className="hover:text-white transition-colors">
                Formulário de Contato & Maps
              </a>
            </li>
          </ul>
        </div>

        {/* Complete Official Contact Details */}
        <div className="md:col-span-4 space-y-2.5 text-sm">
          <h3 className="font-semibold text-white">Contato & Localização Oficial</h3>
          <ul className="space-y-2.5 text-[#CBD9C2]">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#A3D96C] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {POUSADA_INFO.address} · CEP {POUSADA_INFO.cep}
              </span>
            </li>
            <li className="flex items-start gap-2 tabular-nums">
              <Phone className="w-4 h-4 text-[#A3D96C] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="block">Atendimento / Restaurante: {POUSADA_INFO.phones.general}</span>
                <span className="block">Reservas: {POUSADA_INFO.phones.reservations}</span>
                <span className="block">Disponibilidade: {POUSADA_INFO.phones.availability}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#A3D96C] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-0.5 break-all">
                <a
                  href={`mailto:${POUSADA_INFO.emails.contactFormRecipient}`}
                  className="block hover:text-white transition-colors"
                >
                  {POUSADA_INFO.emails.contactFormRecipient}
                </a>
                <a
                  href={`mailto:${POUSADA_INFO.emails.reservationsRecipient}`}
                  className="block hover:text-white transition-colors"
                >
                  {POUSADA_INFO.emails.reservationsRecipient}
                </a>
              </div>
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
            © {new Date().getFullYear()} {POUSADA_INFO.legalName} — CNPJ {POUSADA_INFO.cnpj}. Todos
            os direitos reservados.
          </p>
          <p>{POUSADA_INFO.website}</p>
        </div>
      </div>
    </footer>
  );
}
