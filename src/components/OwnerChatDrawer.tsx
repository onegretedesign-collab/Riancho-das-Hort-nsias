import { useEffect, useRef, useState } from 'react';
import { Lock, Phone, Send, ShieldCheck, X } from 'lucide-react';
import { POUSADA_INFO } from '../data/bungalows';
import type { Bungalow, ChatMessage } from '../types/bungalow';
import { formatBRL } from '../utils/filters';

interface OwnerChatDrawerProps {
  isOpen: boolean;
  bungalows: Bungalow[];
  activeUnit: Bungalow | null;
  messages: ChatMessage[];
  isOwnerTyping: boolean;
  onClose: () => void;
  onSelectUnit: (unit: Bungalow | null) => void;
  onSendMessage: (text: string) => void;
}

const QUICK_PROMPTS = [
  'Qual o valor e disponibilidade para o próximo fim de semana?',
  'Quais bangalôs têm ar-condicionado ou cozinha própria?',
  'Como funciona o restaurante da pousada e as piscinas?',
  'Quais os telefones, e-mail e CNPJ da pousada?',
];

export function OwnerChatDrawer({
  isOpen,
  bungalows,
  activeUnit,
  messages,
  isOwnerTyping,
  onClose,
  onSelectUnit,
  onSendMessage,
}: OwnerChatDrawerProps) {
  const [draft, setDraft] = useState('');
  const [validationError, setValidationError] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages.length, isOwnerTyping]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = draft.trim();
    if (!cleaned) {
      setValidationError('Digite sua mensagem antes de enviar.');
      return;
    }
    setValidationError('');
    onSendMessage(cleaned);
    setDraft('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-[#182613]/50 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-md h-full bg-[#F7F8F3] shadow-2xl border-l border-[#DFE5D6] flex flex-col">
        {/* Verified Host Header */}
        <div className="px-5 py-4 bg-[#24361A] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A3D96C] shrink-0" aria-hidden="true" />
              <h2 id="chat-drawer-title" className="text-base font-bold truncate">
                Proprietário · {POUSADA_INFO.name}
              </h2>
            </div>
            <p className="text-xs text-[#D6E4CA] mt-0.5 truncate tabular-nums">
              {POUSADA_INFO.phones.availability} · {POUSADA_INFO.phones.reservations}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar chat com proprietário"
            className="w-10 h-10 rounded-full bg-white/12 hover:bg-white/22 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3D96C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Transparency Assurance Strip */}
        <div className="px-4 py-2.5 bg-[#EFF2E8] border-b border-[#DFE5D6] flex items-center justify-between gap-2 text-[11px] text-[#24361A] shrink-0">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#4A6B35] shrink-0" aria-hidden="true" />
            <span>CNPJ {POUSADA_INFO.cnpj} · Protocolo registrado.</span>
          </span>
          <a
            href={POUSADA_INFO.phones.availabilityWhatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#4A6B35] hover:underline whitespace-nowrap shrink-0"
          >
            <Phone className="w-3 h-3" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Unit Context Switcher */}
        <div className="px-4 py-3 bg-white border-b border-[#E4EAD9] shrink-0">
          <label
            htmlFor="chat-unit-select"
            className="block text-[11px] font-semibold text-[#6D7A67] mb-1"
          >
            Assunto / Unidade em negociação
          </label>
          <div className="flex items-center gap-2">
            <select
              id="chat-unit-select"
              value={activeUnit?.id || 'general'}
              onChange={(e) => {
                const chosen = bungalows.find((b) => b.id === e.target.value) || null;
                onSelectUnit(chosen);
              }}
              className="flex-1 px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E261B] bg-[#F7F8F3] border border-[#DFE5D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B35] cursor-pointer"
            >
              <option value="general">Atendimento Geral — Todos os 13 Bangalôs</option>
              {bungalows.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({formatBRL(b.pricePerNight)}/diária)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages Thread */}
        <div
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div
                  key={msg.id}
                  className="text-center text-[11px] text-[#6D7A67] bg-[#EFF2E8]/80 rounded-xl px-3 py-2 mx-auto max-w-[92%]"
                >
                  {msg.text}
                </div>
              );
            }

            const isGuest = msg.sender === 'guest';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                    isGuest
                      ? 'bg-[#4A6B35] text-white rounded-br-sm'
                      : 'bg-white text-[#1E261B] border border-[#E4EAD9] rounded-bl-sm'
                  }`}
                >
                  {msg.protocolCode && (
                    <p
                      className={`text-[10px] font-semibold mb-1 tabular-nums ${
                        isGuest ? 'text-[#DCEEC8]' : 'text-[#4A6B35]'
                      }`}
                    >
                      Protocolo {msg.protocolCode}
                    </p>
                  )}
                  <p>{msg.text}</p>
                </div>
                <span className="mt-1 px-1 text-[10px] text-[#6D7A67] tabular-nums">
                  {isGuest ? 'Você' : 'Proprietário'} · {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isOwnerTyping && (
            <div className="flex items-start">
              <div className="bg-white border border-[#E4EAD9] rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs text-[#6D7A67]">
                Proprietário está digitando...
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>

        {/* Quick Questions Bar */}
        <div className="px-4 py-2.5 bg-[#F7F8F3] border-t border-[#E4EAD9] flex gap-1.5 overflow-x-auto shrink-0">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSendMessage(prompt)}
              className="px-3 py-1.5 text-xs font-medium text-[#24361A] bg-white hover:bg-[#EFF2E8] border border-[#DFE5D6] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3.5 bg-white border-t border-[#DFE5D6] shrink-0"
        >
          {validationError && (
            <p className="text-xs font-medium text-[#A63A2B] mb-2 px-1">{validationError}</p>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="owner-chat-input" className="sr-only">
              Escreva sua mensagem para o proprietário
            </label>
            <input
              ref={inputRef}
              id="owner-chat-input"
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Pergunte sobre datas, valores ou comodidades..."
              className="flex-1 px-4 py-2.5 text-sm bg-[#F7F8F3] border border-[#DFE5D6] rounded-full text-[#1E261B] placeholder:text-[#7D8A77] focus:outline-none focus:ring-2 focus:ring-[#4A6B35]"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              className="w-11 h-11 rounded-full bg-[#4A6B35] hover:bg-[#3B5729] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6B35]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
