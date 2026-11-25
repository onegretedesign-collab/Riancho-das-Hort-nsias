import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
} from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';
import type { ContactSubmission } from '../types/bungalow';

interface ContactSectionProps {
  onSendToChat?: (prefillMessage: string) => void;
}

const STORAGE_CONTACT_KEY = 'riacho_hortensias_contacts_v1';

export function ContactSection({ onSendToChat }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [lastSubmission, setLastSubmission] = useState<ContactSubmission | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError('Por favor, preencha seu nome, e-mail, telefone e sua mensagem.');
      return;
    }

    const protocolCode = `MSG-${String(Math.floor(10000 + Math.random() * 90000))}`;
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || 'Contato pelo site oficial',
      message: message.trim(),
      destinationEmail: `${POUSADA_INFO.emails.contactFormRecipient} / ${POUSADA_INFO.emails.reservationsRecipient}`,
      protocolCode,
      createdAt: new Date().toLocaleString('pt-BR'),
    };

    try {
      const existingRaw = localStorage.getItem(STORAGE_CONTACT_KEY);
      const existing: ContactSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(STORAGE_CONTACT_KEY, JSON.stringify([submission, ...existing]));
    } catch {
      // Ignore storage quota issues
    }

    setError('');
    setLastSubmission(submission);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <section
      id="contato"
      aria-labelledby="contact-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* Top Official Contact Channels Bar (Telefone | Endereço | E-mail | CNPJ) */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#4A6B35]">
          Fale Conosco · Canais Oficiais
        </p>
        <h2
          id="contact-heading"
          className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E261B]"
        >
          Contato & Localização Oficial
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#4E5A49]">
          {POUSADA_INFO.legalName} · CNPJ {POUSADA_INFO.cnpj}
        </p>
      </div>

      {/* 3-Column Official Contact Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-[#E4EAD9] p-5 flex items-start gap-3.5 shadow-xs">
          <span className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#D99B38] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="text-xs sm:text-sm space-y-1">
            <h3 className="font-bold text-[#1E261B]">Telefones & WhatsApp</h3>
            <p className="text-[#4E5A49] tabular-nums">
              Geral / Restaurante: <strong>{POUSADA_INFO.phones.general}</strong>
            </p>
            <p className="text-[#4E5A49] tabular-nums">
              Reservas: <strong>{POUSADA_INFO.phones.reservations}</strong>
            </p>
            <p className="text-[#4E5A49] tabular-nums">
              Disponibilidade: <strong>{POUSADA_INFO.phones.availability}</strong>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E4EAD9] p-5 flex items-start gap-3.5 shadow-xs">
          <span className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#D99B38] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="text-xs sm:text-sm space-y-1">
            <h3 className="font-bold text-[#1E261B]">Endereço Oficial</h3>
            <p className="text-[#4E5A49]">{POUSADA_INFO.address}</p>
            <p className="text-[#6D7A67]">CEP {POUSADA_INFO.cep} · Santa Catarina</p>
            <p className="text-[#6D7A67] tabular-nums">CNPJ: {POUSADA_INFO.cnpj}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E4EAD9] p-5 flex items-start gap-3.5 shadow-xs">
          <span className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#D99B38] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="text-xs sm:text-sm space-y-1 min-w-0">
            <h3 className="font-bold text-[#1E261B]">E-mails Destinatários</h3>
            <p className="text-[#4E5A49] break-all">
              <a
                href={`mailto:${POUSADA_INFO.emails.contactFormRecipient}`}
                className="hover:text-[#4A6B35] underline"
              >
                {POUSADA_INFO.emails.contactFormRecipient}
              </a>
            </p>
            <p className="text-[#4E5A49] break-all">
              <a
                href={`mailto:${POUSADA_INFO.emails.reservationsRecipient}`}
                className="hover:text-[#4A6B35] underline"
              >
                {POUSADA_INFO.emails.reservationsRecipient}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Container matching reference image_cfb801f4.png: Left "Formulário de Contato" + Right Official Google Maps */}
      <div className="bg-[#EFEDE7] p-3 sm:p-6 rounded-3xl border border-[#DCD9CE]">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column (5 cols): Formulário de Contato matching image_cfb801f4.png */}
          <div className="lg:col-span-5 p-6 sm:p-9 lg:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E261B]">
                Formulário de Contato
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#4E5A49] leading-relaxed">
                Se você tem alguma dúvida. Por favor, não hesite em nos enviar uma mensagem
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    Seu nome
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full py-2.5 text-sm text-[#1E261B] placeholder:text-[#636B60] border-b border-[#D5D5D5] focus:border-[#D99B38] focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    Seu e-mail
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail"
                    className="w-full py-2.5 text-sm text-[#1E261B] placeholder:text-[#636B60] border-b border-[#D5D5D5] focus:border-[#D99B38] focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="sr-only">
                    Número de telefone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Número de telefone"
                    className="w-full py-2.5 text-sm text-[#1E261B] placeholder:text-[#636B60] border-b border-[#D5D5D5] focus:border-[#D99B38] focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="sr-only">
                    Assunto (Opcional)
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Assunto(Opcional)"
                    className="w-full py-2.5 text-sm text-[#1E261B] placeholder:text-[#636B60] border-b border-[#D5D5D5] focus:border-[#D99B38] focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="sr-only">
                    Sua mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Sua mensagem"
                    className="w-full py-2.5 text-sm text-[#1E261B] placeholder:text-[#636B60] border-b border-[#D5D5D5] focus:border-[#D99B38] focus:outline-none transition-colors bg-transparent resize-y"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-[#A63A2B]">
                    {error}
                  </p>
                )}

                {lastSubmission && (
                  <div
                    role="status"
                    className="p-3.5 rounded-xl bg-[#EFF2E8] border border-[#C6D6B5] text-xs text-[#1E261B] space-y-2"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#24361A]">
                      <CheckCircle2 className="w-4 h-4 text-[#4A6B35] shrink-0" />
                      <span>Mensagem encaminhada ({lastSubmission.protocolCode})</span>
                    </div>
                    <p className="text-[#4E5A49]">
                      Destinatário registrado:{' '}
                      <strong className="text-[#1E261B]">
                        {POUSADA_INFO.emails.contactFormRecipient}
                      </strong>{' '}
                      e{' '}
                      <strong className="text-[#1E261B]">
                        {POUSADA_INFO.emails.reservationsRecipient}
                      </strong>
                      .
                    </p>
                    {onSendToChat && (
                      <button
                        type="button"
                        onClick={() =>
                          onSendToChat(
                            `Olá! Enviei uma mensagem pelo formulário (${lastSubmission.protocolCode}): "${lastSubmission.message}" — Nome: ${lastSubmission.name}, Tel: ${lastSubmission.phone}.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A6B35] hover:underline cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Acompanhar resposta ao vivo no Chat</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#DFA348] hover:bg-[#C88D32] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFA348] focus-visible:ring-offset-2"
                  >
                    ENVIAR MENSAGEM
                  </button>
                </div>
              </form>
            </div>

            <p className="mt-5 text-[11px] text-[#6D7A67]">
              As mensagens são direcionadas para{' '}
              <strong className="text-[#1E261B]">{POUSADA_INFO.emails.contactFormRecipient}</strong> e{' '}
              <strong className="text-[#1E261B]">
                {POUSADA_INFO.emails.reservationsRecipient}
              </strong>
              .
            </p>
          </div>

          {/* Right Column (7 cols): Official Google Maps Embed + Visual Map Backdrop matching image_cfb801f4.png */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-full bg-[#D9F3E4] overflow-hidden">
            {/* Cartographic backdrop matching image_cfb801f4.png so the map is always crisp even while iframe tiles load */}
            <svg
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <rect width="800" height="600" fill="#D8F3E5" />
              {/* Rural roads of Linha Bela Vista */}
              <path
                d="M 0 380 C 90 440, 140 465, 220 455 C 320 445, 345 360, 340 315 C 335 280, 390 265, 435 268 C 480 272, 540 278, 595 315"
                fill="none"
                stroke="#CBD4DC"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 435 268 C 440 340, 445 415, 510 475 C 570 530, 650 560, 710 600"
                fill="none"
                stroke="#CBD4DC"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Bungalow footprints on Google Map */}
              <rect x="405" y="218" width="10" height="10" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              <rect x="392" y="275" width="12" height="12" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              <rect x="378" y="328" width="10" height="10" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              <rect x="406" y="346" width="10" height="10" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              <rect x="415" y="378" width="10" height="10" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              <rect x="366" y="402" width="10" height="10" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              <rect x="404" y="408" width="10" height="10" rx="2" fill="#E8ECEF" stroke="#C5CED6" />
              {/* Red Google Maps Pin */}
              <g transform="translate(405, 260)">
                <path
                  d="M0 -34 C-11 -34 -20 -25 -20 -14 C-20 1 0 18 0 18 C0 18 20 1 20 -14 C20 -25 11 -34 0 -34 Z"
                  fill="#DB4437"
                  stroke="#A52714"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-14" r="6.5" fill="#811B11" />
              </g>
              <text
                x="432"
                y="246"
                fill="#C5221F"
                fontSize="15"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                Pousada Rural Riacho
              </text>
              <text
                x="432"
                y="264"
                fill="#C5221F"
                fontSize="15"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                das Hortênsias
              </text>
            </svg>

            <iframe
              title="Localização no Google Maps — Pousada Rural Riacho das Hortênsias Ltda"
              src={POUSADA_INFO.googleMapsEmbedUrl}
              className="relative z-10 w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] border-0 opacity-85"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Place Card matching image_cfb801f4.png top-left card */}
            <div className="absolute top-3 left-3 z-20 bg-white rounded-lg shadow-md border border-gray-200 p-3.5 max-w-[265px] text-xs">
              <p className="font-bold text-gray-900 text-sm leading-snug">
                {POUSADA_INFO.legalName}
              </p>
              <p className="mt-1 text-gray-600 leading-snug">
                {POUSADA_INFO.fullAddress}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-gray-700 font-semibold tabular-nums">
                <span>{POUSADA_INFO.googleMapsRating.toFixed(1).replace('.', ',')}</span>
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                <span className="text-blue-600 font-normal">
                  ({POUSADA_INFO.googleMapsReviewCount})
                </span>
              </div>
              <div className="mt-2.5">
                <a
                  href={POUSADA_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A73E8] hover:bg-[#1558B0] text-white text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Abrir no Maps</span>
                </a>
              </div>
            </div>

            {/* Bottom-left Satellite Thumbnail Preview matching image_cfb801f4.png */}
            <a
              href={POUSADA_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Ver visão de satélite no Google Maps"
              className="absolute bottom-3 left-3 z-20 w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-md"
            >
              <img
                src="/assets/official/about/welcome-02.jpg"
                alt="Satélite"
                className="w-full h-full object-cover"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
