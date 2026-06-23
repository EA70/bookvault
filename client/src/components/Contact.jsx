import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, User, Send, MapPin, Clock, ChevronRight } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simuler un envoi — à remplacer par votre appel API
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const subjects = [
    "Problème technique",
    "Question sur un emprunt",
    "Signaler un livre manquant",
    "Suggestion d'amélioration",
    "Autre",
  ];
const infos = [
  {
    icon: <Mail className="w-4 h-4" />,
    label: "Email",
    value: "support@buchvault.com",
    color: "text-slate-800",
    bg: " border-slate-200/80",
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    label: "Localisation",
    value: "Bibliothèque Universitaire, Bât. A",
    color: "text-slate-800",
    bg: " border-slate-200/80",
  },
  {
    icon: <Clock className="w-4 h-4" />,
    label: "Disponibilité",
    value: "Lun – Ven · 8h00 – 18h00",
    color: "text-slate-800",
    bg: " border-slate-200/80",
  },
];


  return (
    <div className="min-h-screen relative overflow-hidden">

            {/* Fond décoratif */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl" />
      </div>
 

       <div className="relative overflow-hidden bg-white py-16 sm:py-24">

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
 
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
            Contactez-<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">nous</span> !
          </h1>
          <p className="mt-6 text-base  text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Vous avez une question, un problème technique ou une suggestion ? Notre équipe est là pour vous aider. Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24h ouvrées.
          </p>
        </div>
        
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">


        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
            Support & Contact
          </span>

          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Une question sur votre emprunt, un problème technique ou une suggestion ? Notre équipe vous répond sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Colonne gauche — infos */}
          <div className="flex flex-col gap-4">

            {/* Cartes infos */}
            {infos.map((info) => (
              <div
                key={info.label}
                className={`flex items-start gap-3.5 p-4 rounded border ${info.bg} transition-all duration-200`}
              >
                <div className={`mt-0.5 shrink-0 ${info.color}`}>
                  {info.icon}
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">
                    {info.label}
                  </p>
                  <p className="text-sm font-medium text-slate-600">
                    {info.value}
                  </p>
                </div>
              </div>
            ))}

            {/* FAQ rapide */}
            <div className="  border border-slate-400 rounded p-5 mt-2">
              <h3 className="text-xs font-bold   uppercase tracking-widest mb-4">
                Questions fréquentes
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  "Comment prolonger un emprunt ?",
                  "Que faire si je perds un livre ?",
                  "Comment réserver un livre indisponible ?",
                ].map((q) => (
                  <div
                    key={q}
                    className="flex items-start gap-2 text-xs text-slate-800 hover:text-slate-600 transition-colors cursor-pointer group"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-violet-500 group-hover:translate-x-0.5 transition-transform" />
                    {q}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Colonne droite — formulaire */}
          <div className="lg:col-span-2   rounded overflow-hidden  ">

            {/* Header formulaire */}
            <div className=" px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold ">Envoyer un message</h2>
                <p className="text-[11px] text-slate-500">Réponse garantie sous 24h ouvrées</p>
              </div>
            </div>

            {submitted ? (
              /* État succès */
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-white mb-2">Message envoyé !</h3>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
                  Merci pour votre message. Notre équipe vous répondra dans les 24h ouvrées.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all duration-200 active:scale-95"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Nom */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Mando Elie"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded  border border-slate-400 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="vous@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded   border border-slate-400 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Sujet — pleine largeur */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Sujet
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 pr-8 py-2.5 rounded   border border-slate-400 text-sm   focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Choisissez un sujet...</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Message — pleine largeur */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Décrivez votre demande en détail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded  border border-slate-400 text-sm   placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-[10px] text-slate-600 text-right">
                    {formData.message.length} / 500 caractères
                  </p>
                </div>

                {/* Submit */}
                <div className="sm:col-span-2 flex items-center justify-between pt-2 border-t border-slate-400">
                  <p className="text-[10px] text-slate-600">
                    Réponse sous 24h ouvrées
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-violet-600 hover:bg-violet-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}