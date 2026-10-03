"use client";

import { useState } from "react";
import type { AgentProfile } from "@/types/property";

interface AgentContactCardProps {
  agent: AgentProfile;
  propertyTitle: string;
  propertyLocation: string;
  dict: any;
}

export default function AgentContactCard({
  agent,
  propertyTitle,
  propertyLocation,
  dict,
}: AgentContactCardProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Form states for schedule modal
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("10:00");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [scheduleSent, setScheduleSent] = useState(false);

  // Form states for contact modal
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState(
    `Hola ${agent.name}, me gustaría recibir más información sobre la propiedad "${propertyTitle}" ubicada en ${propertyLocation}.`,
  );
  const [contactSent, setContactSent] = useState(false);

  const cleanPhone = agent.phone ? agent.phone.replace(/[^\d+]/g, "") : "";
  const cleanPhoneDigits = agent.phone ? agent.phone.replace(/\D/g, "") : "";

  const whatsappMessage = encodeURIComponent(
    `Hola ${agent.name}, estoy interesado/a en la propiedad "${propertyTitle}" (${propertyLocation}). ¿Podrías darme más información?`,
  );

  const whatsappUrl = cleanPhoneDigits
    ? `https://wa.me/${cleanPhoneDigits}?text=${whatsappMessage}`
    : `mailto:${agent.email}?subject=${encodeURIComponent(`Consulta: ${propertyTitle}`)}&body=${whatsappMessage}`;

  const handleCall = () => {
    if (cleanPhone) {
      window.location.href = `tel:${cleanPhone}`;
    } else {
      setShowContactModal(true);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSent(true);
    setTimeout(() => {
      // If WhatsApp available, option to open WhatsApp confirmation
      if (cleanPhoneDigits) {
        const scheduleMsg = encodeURIComponent(
          `Hola ${agent.name}, solicito agendar una visita para "${propertyTitle}".\n📅 Fecha: ${visitDate}\n⏰ Hora: ${visitTime}\n👤 Nombre: ${visitorName}\n📞 Teléfono: ${visitorPhone}`,
        );
        window.open(`https://wa.me/${cleanPhoneDigits}?text=${scheduleMsg}`, "_blank");
      }
    }, 800);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      window.location.href = `mailto:${agent.email}?subject=${encodeURIComponent(
        `Consulta sobre ${propertyTitle}`,
      )}&body=${encodeURIComponent(
        `${contactMessage}\n\nDe: ${contactName} (${contactEmail})`,
      )}`;
    }, 600);
  };

  const getAgentRoleLabel = () => {
    if (agent.role === "admin") return dict.roles?.admin || "Administrador";
    if (agent.role === "agent") return dict.propertyPage?.topRated || "Agente Destacado";
    return dict.propertyPage?.topRated || "Agente Inmobiliario";
  };

  return (
    <div className="w-full">
      {/* Agent Info Row */}
      <div className="flex items-center gap-4 mb-6">
        {agent.avatar_url ? (
          <img
            alt={agent.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-black/5"
            src={agent.avatar_url}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-mosque/10 text-mosque border-2 border-white shadow-sm flex items-center justify-center font-bold text-lg">
            {agent.name
              ? agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "AG"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-nordic truncate">{agent.name}</h3>
          <div className="flex items-center gap-1 text-xs text-mosque font-medium">
            <span className="material-icons text-[14px]">star</span>
            <span>{getAgentRoleLabel()}</span>
          </div>
          {agent.email && (
            <p className="text-[11px] text-nordic/50 truncate font-mono mt-0.5">
              {agent.email}
            </p>
          )}
        </div>

        {/* Quick Action Icon Buttons */}
        <div className="flex gap-2 shrink-0">
          {/* WhatsApp / Chat Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={cleanPhone ? `WhatsApp: ${agent.phone}` : `Email: ${agent.email}`}
            className="p-2.5 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center"
          >
            <span className="material-icons text-base">chat</span>
          </a>

          {/* Call Phone Button */}
          <button
            type="button"
            onClick={handleCall}
            title={cleanPhone ? `Llamar: ${agent.phone}` : "Contactar al agente"}
            className="p-2.5 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center cursor-pointer"
          >
            <span className="material-icons text-base">call</span>
          </button>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="w-full bg-mosque hover:bg-primary-hover text-white py-3.5 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
        >
          <span className="material-icons text-xl group-hover:scale-110 transition-transform">
            calendar_today
          </span>
          {dict.propertyPage?.scheduleVisit || "Agendar Visita"}
        </button>

        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-3.5 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-mosque/5 active:scale-[0.99]"
        >
          <span className="material-icons text-xl">mail_outline</span>
          {dict.propertyPage?.contactAgent || "Contactar Agente"}
        </button>
      </div>

      {/* ─── Modal: Agendar Visita ────────────────────────────────────────── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nordic/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              type="button"
              onClick={() => {
                setShowScheduleModal(false);
                setScheduleSent(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-nordic hover:bg-gray-100 transition-colors"
            >
              <span className="material-icons text-lg">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-mosque/10 text-mosque flex items-center justify-center">
                <span className="material-icons text-xl">calendar_month</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-nordic">
                  {dict.propertyPage?.scheduleVisit || "Agendar Visita"}
                </h3>
                <p className="text-xs text-nordic/60 truncate max-w-[280px]">
                  {propertyTitle}
                </p>
              </div>
            </div>

            {scheduleSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-icons text-2xl">check</span>
                </div>
                <h4 className="font-semibold text-nordic">
                  ¡Solicitud Enviada!
                </h4>
                <p className="text-xs text-nordic/60">
                  {agent.name} se pondrá en contacto contigo a la brevedad para
                  confirmar el horario de la visita.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setScheduleSent(false);
                  }}
                  className="mt-4 px-6 py-2 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-nordic/70 mb-1">
                      Fecha preferida
                    </label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-nordic/70 mb-1">
                      Horario
                    </label>
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic bg-white"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-nordic/70 mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-nordic/70 mb-1">
                      Tu Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 11..."
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-nordic/70 mb-1">
                      Tu Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-mosque hover:bg-primary-hover text-white py-3 rounded-lg font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-icons text-base">send</span>
                    Confirmar y Notificar al Agente
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Modal: Contactar Agente ───────────────────────────────────────── */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nordic/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              type="button"
              onClick={() => {
                setShowContactModal(false);
                setContactSent(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-nordic hover:bg-gray-100 transition-colors"
            >
              <span className="material-icons text-lg">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-mosque/10 text-mosque flex items-center justify-center">
                <span className="material-icons text-xl">mail</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-nordic">
                  {dict.propertyPage?.contactAgent || "Contactar Agente"}
                </h3>
                <p className="text-xs text-nordic/60">
                  Escribe un mensaje directo a {agent.name}
                </p>
              </div>
            </div>

            {agent.phone && (
              <div className="mb-4 p-3 rounded-lg bg-hint-green border border-primary/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-nordic font-medium">
                  <span className="material-icons text-mosque text-sm">phone</span>
                  <span>{agent.phone}</span>
                </div>
                <a
                  href={`tel:${cleanPhone}`}
                  className="text-mosque font-bold hover:underline"
                >
                  Llamar ahora
                </a>
              </div>
            )}

            {contactSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-icons text-2xl">check</span>
                </div>
                <h4 className="font-semibold text-nordic">
                  Abriendo cliente de correo...
                </h4>
                <p className="text-xs text-nordic/60">
                  Se ha preparado el mensaje para ser enviado a {agent.email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowContactModal(false);
                    setContactSent(false);
                  }}
                  className="mt-4 px-6 py-2 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-nordic/70 mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Gómez"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-nordic/70 mb-1">
                    Tu Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maria@ejemplo.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-nordic/70 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic placeholder-gray-400 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-mosque hover:bg-primary-hover text-white py-3 rounded-lg font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-icons text-base">mail_outline</span>
                    Enviar Mensaje a {agent.email}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
