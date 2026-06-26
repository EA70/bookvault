import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "Comment créer un compte sur BuchVault ?",
    answer: "Rendez-vous sur la page d'inscription et remplissez le formulaire avec vos informations étudiantes. Votre compte est activé instantanément et sécurisé par jeton d'authentification.",
    category: "Compte",
  },
  {
    question: "Combien de livres puis-je emprunter simultanément ?",
    answer: "En tant qu'étudiant, vous pouvez emprunter jusqu'à 3 livres en même temps. Cette limite permet à tous les membres de la communauté d'accéder aux ouvrages disponibles.",
    category: "Emprunts",
  },
  {
    question: "Quelle est la durée maximale d'un emprunt ?",
    answer: "La durée standard d'un emprunt est de 14 jours. Un renouvellement est possible depuis votre espace personnel si personne d'autre n'a réservé l'ouvrage.",
    category: "Emprunts",
  },
  {
    question: "Que se passe-t-il si je rends un livre en retard ?",
    answer: "Un retard est signalé automatiquement dans votre historique. L'administrateur sera notifié et pourra, selon la politique de l'établissement, restreindre temporairement vos emprunts.",
    category: "Emprunts",
  },
  {
    question: "Comment réserver un livre actuellement indisponible ?",
    answer: "Sur la fiche du livre, cliquez sur 'Réserver'. Vous serez automatiquement notifié dès que l'ouvrage sera rendu et disponible à nouveau.",
    category: "Catalogue",
  },
  {
    question: "Le catalogue est-il accessible sans connexion ?",
    answer: "Une sélection aléatoire du catalogue est visible sur la page d'accueil sans connexion. L'accès complet au catalogue, aux emprunts et à l'historique nécessite un compte étudiant.",
    category: "Catalogue",
  },
  {
    question: "Comment contacter l'équipe en cas de problème ?",
    answer: "Utilisez le formulaire de contact disponible sur la page Contact. Notre équipe vous répond sous 24h ouvrées du lundi au vendredi.",
    category: "Support",
  },
  {
    question: "Mes données personnelles sont-elles sécurisées ?",
    answer: "Oui. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos informations avec des tiers. Votre authentification est gérée par jeton sécurisé.",
    category: "Compte",
  },
];

const categories = ["Tous", "Compte", "Emprunts", "Catalogue", "Support"];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = faqs.filter(
    (f) => activeCategory === "Tous" || f.category === activeCategory
  );

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-3">
            Questions fréquentes
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Tout ce que vous devez savoir sur BuchVault. Vous ne trouvez pas la réponse ?{" "}
            <Link to="/contact" className="text-violet-500 font-medium hover:text-violet-600 transition-colors">
              Contactez-nous
            </Link>
          </p>
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordéon */}
        <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden">
          {filtered.map((faq, index) => (
            <div key={index} className="bg-white">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Badge catégorie */}
                  <span className="text-[10px] font-semibold text-violet-500 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded shrink-0 hidden sm:inline-block">
                    {faq.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {faq.question}
                  </span>
                </div>

                {/* Icône +/- */}
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all duration-200 ${
                  openIndex === index
                    ? "bg-violet-600 text-white rotate-45"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </button>

              {/* Réponse */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-48" : "max-h-0"
              }`}>
                <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bas */}
        <div className="mt-10 text-center p-6 rounded">
          <p className="text-sm font-semibold text-slate-700 mb-1">
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Notre équipe est disponible du lundi au vendredi, 8h–18h.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-semibold transition-all duration-200"
          >
            Nous contacter
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}