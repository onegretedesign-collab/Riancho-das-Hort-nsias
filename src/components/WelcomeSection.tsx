import { ChevronRight, Leaf, MapPin, Phone } from 'lucide-react';
import { POUSADA_INFO, POUSADA_SERVICES } from '../data/bungalows';

interface WelcomeSectionProps {
  onOpenChat: () => void;
}

export function WelcomeSection({ onOpenChat }: WelcomeSectionProps) {
  return (
    <section id="sobre" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      {/* Part 1: Official Institutional History ("Nada resiste ao trabalho" · 60 Hectares · 3.000 Hortênsias) */}
      <div className="bg-[#EFF2E8] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E3E9D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Framed Media with Official Institutional Photos */}
          <div className="lg:col-span-5 relative space-y-3">
            <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-md aspect-[3/2] bg-[#DCE4D0]">
              <img
                src="/assets/official/about/welcome-01.jpg"
                alt="Vista da Pousada Rural Riacho das Hortênsias em Santa Helena - SC"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border-2 border-white shadow-xs aspect-[3/2] bg-[#DCE4D0]">
                <img
                  src="/assets/official/about/institucional-1.jpg"
                  alt="Jardins, hortênsias e taipas de pedra da Pousada Rural Riacho das Hortênsias"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden border-2 border-white shadow-xs aspect-[3/2] bg-[#DCE4D0]">
                <img
                  src="/assets/official/about/welcome-02.jpg"
                  alt="Piscinas e natureza preservada na Pousada Rural Riacho das Hortênsias"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Top-left organic seal matching reference's medallion */}
            <div className="absolute -top-4 -left-3 w-20 h-20 rounded-full bg-[#4A6B35] text-white shadow-md border-4 border-[#EFF2E8] flex flex-col items-center justify-center text-center px-1">
              <Leaf className="w-4 h-4 mb-0.5 text-[#C5E898]" aria-hidden="true" />
              <span className="text-[10px] font-bold leading-tight">Desde 2020</span>
            </div>
          </div>

          {/* Right Complete Official Story from riachodashortensias.tur.br/sobre/ */}
          <div className="lg:col-span-7 space-y-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A6B35]">
              <span>História Oficial · {POUSADA_INFO.legalName}</span>
              <Leaf className="w-4 h-4 shrink-0" aria-hidden="true" />
            </p>

            <h2
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E261B] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              “{POUSADA_INFO.philosophy}”: um cenário da Serra Gaúcha em Santa Helena - SC
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-[#4E5A49] leading-relaxed">
              {POUSADA_INFO.historyParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Concrete factual highlights from the official site */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/80 rounded-xl p-3 border border-[#DFE5D6]">
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">
                  60 ha
                </p>
                <p className="text-xs text-[#6D7A67]">Mata nativa preservada</p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-[#DFE5D6]">
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">
                  3.000
                </p>
                <p className="text-xs text-[#6D7A67]">Mudas de hortênsias</p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-[#DFE5D6]">
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">
                  13
                </p>
                <p className="text-xs text-[#6D7A67]">Bangalôs de demolição</p>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-[#DFE5D6]">
                <p className="font-display text-2xl font-semibold text-[#1E261B] tabular-nums">
                  2
                </p>
                <p className="text-xs text-[#6D7A67]">Piscinas com cascata</p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4A6B35] hover:bg-[#3B5729] rounded-full transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EFF2E8]"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Ver Contato & Mapa Oficial</span>
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

      {/* Part 2: Official Services & Infrastructure ("Serviços Adicionais" from riachodashortensias.tur.br) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#4A6B35]">
            Estrutura Completa de Lazer e Gastronomia
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#1E261B]">
            Serviços Oficiais da Pousada
          </h3>
          <p className="mt-2 text-sm sm:text-base text-[#4E5A49]">
            Além dos 13 bangalôs em madeira de demolição, sua estadia conta com infraestrutura
            completa integrada à natureza em Linha Bela Vista.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {POUSADA_SERVICES.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-2xl border border-[#E4EAD9] overflow-hidden shadow-xs flex flex-col"
            >
              <div className="aspect-[3/2] w-full overflow-hidden bg-[#EFF2E8]">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-base font-semibold text-[#1E261B]">
                    {service.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-[#4E5A49] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {service.contactNote && (
                  <p className="mt-3 pt-2.5 border-t border-[#EDF1E6] flex items-center gap-1.5 text-[11px] font-semibold text-[#4A6B35] tabular-nums">
                    <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{service.contactNote}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
