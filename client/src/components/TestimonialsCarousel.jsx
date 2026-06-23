
import { useRef, useEffect } from "react";

const testimonials = [
  {
    name: "Amara Diallo",
    role: "Étudiante en L2 Droit",
    comment: "BuchVault a complètement changé ma façon d'emprunter des livres. Plus besoin de faire la queue, tout est là en quelques clics !",
    rating: 5,
    positive: true,
  },
  {
    name: "Lucas Martin",
    role: "Étudiant en M1 Informatique",
    comment: "L'interface est vraiment agréable. Je retrouve facilement mes livres et le suivi des emprunts est super pratique.",
    rating: 5,
    positive: true,
  },
  {
    name: "Chloé Bernard",
    role: "Étudiante en L3 Littérature",
    comment: "Parfois certains livres sont indisponibles trop longtemps. J'aimerais une notification quand un livre redevient disponible.",
    rating: 3,
    positive: false,
  },
  {
    name: "Karim Benali",
    role: "Doctorant en Philosophie",
    comment: "La lecture reste le meilleur investissement de temps qui soit. BuchVault me donne accès à des textes rares introuvables ailleurs.",
    rating: 5,
    positive: true,
  },
  {
    name: "Sophie Leclerc",
    role: "Étudiante en M2 Sciences",
    comment: "Le catalogue est immense mais la recherche pourrait être plus précise. Il manque un filtre par année de publication.",
    rating: 3,
    positive: false,
  },
  {
    name: "Thomas Nguyen",
    role: "Étudiant en L1 Économie",
    comment: "J'ai découvert des auteurs incroyables grâce aux suggestions du catalogue. La lecture a élargi ma vision du monde.",
    rating: 5,
    positive: true,
  },
  {
    name: "Fatou Sow",
    role: "Étudiante en Master Communication",
    comment: "Très bonne expérience globalement ! Le design est élégant et moderne. Je recommande à tous les étudiants de ma promo.",
    rating: 5,
    positive: true,
  },
  {
    name: "Antoine Morel",
    role: "Étudiant en L3 Histoire",
    comment: "L'application est bien pensée mais l'onboarding pourrait être amélioré. J'ai mis du temps à retrouver mon historique.",
    rating: 3,
    positive: false,
  },
  {
    name: "Inès Dupont",
    role: "Étudiante en Psychologie",
    comment: "Lire 30 minutes par jour a transformé ma concentration. BuchVault me donne accès à tout ce dont j'ai besoin.",
    rating: 5,
    positive: true,
  },
  {
    name: "Mehdi Rachid",
    role: "Étudiant en BTS Informatique",
    comment: "Le système de panier d'emprunt est vraiment bien fait. J'emprunte plusieurs livres à la fois sans aucun problème.",
    rating: 4,
    positive: true,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <div className={`shrink-0 w-72 sm:w-80 p-5 rounded border flex flex-col gap-3 mx-2 ${
      item.positive
        ? "bg-white border-slate-200"
        : "bg-slate-50 border-slate-200"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
            item.positive
              ? "bg-gradient-to-br from-violet-500 to-pink-500 text-white"
              : "bg-slate-200 text-slate-600"
          }`}>
            {item.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
            <p className="text-[10px] text-slate-400">{item.role}</p>
          </div>
        </div>
 
      </div>

      <StarRating rating={item.rating} />

      <p className="text-xs text-slate-500 leading-relaxed flex-1">
        "{item.comment}"
      </p>
    </div>
  );
}

export default function TestimonialsCarousel() {
  const track1 = useRef(null);
  const track2 = useRef(null);

  useEffect(() => {
    const el = track1.current;
    if (!el) return;
    let pos = 0;
    let raf;
    const halfWidth = el.scrollWidth / 2;
    const tick = () => {
      pos += 0.4;
      if (pos >= halfWidth) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = track2.current;
    if (!el) return;
    let pos = 0;
    let raf;
    const halfWidth = el.scrollWidth / 2;
    const tick = () => {
      pos += 0.35;
      if (pos >= halfWidth) pos = 0;
      el.style.transform = `translateX(${-(halfWidth - pos)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const row1 = [...testimonials, ...testimonials];
  const row2 = [...[...testimonials].reverse(), ...[...testimonials].reverse()];

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-3">
            Ce qu'ils en pensent
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Des retours authentiques de notre communauté étudiante — les bons comme les moins bons.
          </p>
        </div>
      </div>

      {/* Ligne 1 → */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex overflow-hidden">
          <div ref={track1} className="flex will-change-transform">
            {row1.map((item, i) => (
              <TestimonialCard key={`r1-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Ligne 2 ← */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex overflow-hidden">
          <div ref={track2} className="flex will-change-transform">
            {row2.map((item, i) => (
              <TestimonialCard key={`r2-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}