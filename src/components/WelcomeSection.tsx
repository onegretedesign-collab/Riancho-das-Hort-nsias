import { ChevronRight, Leaf, MapPin } from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';

interface WelcomeSectionProps {
  onOpenChat: () => void;
}

export function WelcomeSection({ onOpenChat }: WelcomeSectionProps) {
  return (
    <section id="sobre" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-[#EFF2E8] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E3E9D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Framed Media (Evernest Reference Tribute) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-md aspect-[4/3] bg-[#DCE4D0]">
              <img
                src="/assets/bungalows/angelim/main.jpg"
                alt="Bangalô Angelim em meio à mata na Pousada Rural Riacho das Hortênsias"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Top-left organic seal matching reference's "Best Deals" medallion */}
            <div className="absolute -top-3 -left-3 w-20 h-20 rounded-full bg-[#4A6B35] text-white shadow-md border-4 border-[#EFF2E8] flex flex-col items-center justify-center text-center px-1">
              <Leaf className="w-4 h-4 mb-0.5 text-[#C5E898]" aria-hidden="true" />
              <span className="text-[10px] font-bold leading-tight">Turismo Rural</span>
            </div>

            {/* Bottom-right circular leaf emblem matching reference */}
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-white shadow-md border border-[#DFE5D6] flex items-center justify-center text-[#4A6B35]"
            >
              <Leaf className="w-6 h-6" />
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-7 space-y-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A6B35]">
              <span>Bem-vindo ao {POUSADA_INFO.name}</span>
              <Leaf className="w-4 h-4 shrink-0" aria-hidden="true" />
            </p>

            <h2
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E261B] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Ajudamos você a viver mais perto da natureza
            </h2>

            <p className="text-sm sm:text-base text-[#4E5A49] leading-relaxed max-w-xl">
              Localizada em <strong>Linha Bela Vista, Interior de Santa Helena - SC</strong>, nossa
              pousada rural reúne 8 bangalôs exclusivos integrados à mata nativa, piscina cercada
              por gramado, trilhas ecológicas e café colonial preparado com ingredientes da região.
            </p>

            {/* Concrete factual highlights */}
            <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg">
              <div>
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">8</p>
                <p className="text-xs text-[#6D7A67]">Bangalôs exclusivos</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">
                  100%
                </p>
                <p className="text-xs text-[#6D7A67]">Reserva direta</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">
                  0%
                </p>
                <p className="text-xs text-[#6D7A67]">Taxas ocultas</p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <a
                href="#mapa"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EFF2E8]"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Explorar no Mapa</span>
              </a>

              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E261B] hover:text-[#4A6B35] transition-colors cursor-pointer py-2 px-1"
              >
                <span>Falar com a Pousada</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
