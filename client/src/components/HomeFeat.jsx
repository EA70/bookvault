export default function HomeFeat() {
  const features = [
    {
      title: "Gestion Intelligente",
      description:
        "Organisez votre bibliothèque numérique avec un système de catalogage intuitif et performant.",
    },
    {
      title: "Recherche Avancée",
      description:
        "Trouvez instantanément vos livres grâce à notre moteur de recherche optimisé et filtres précis.",
    },
    {
      title: "Synchronisation Cloud",
      description:
        "Accédez à votre collection depuis n'importe quel appareil avec une synchronisation en temps réel.",
    },
    {
      title: "Recommandations",
      description:
        "Découvrez de nouveaux livres basés sur vos préférences et votre historique de lecture.",
    },
    {
      title: "Partage Social",
      description:
        "Partagez vos découvertes avec une communauté de lecteurs passionnés.",
    },
    {
      title: "Statistiques Détaillées",
      description:
        "Suivez votre progression de lecture et analysez vos habitudes de consommation.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Livre SVG décoratif en arrière-plan */}
      <svg
        className="absolute -right-16 top-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-[0.04] pointer-events-none select-none"
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Couverture */}
        <rect x="30" y="10" width="140" height="240" rx="6" fill="#7c3aed" />
        {/* Spine */}
        <rect x="30" y="10" width="18" height="240" rx="4" fill="#5b21b6" />
        {/* Lignes de texte simulées */}
        <rect
          x="62"
          y="50"
          width="90"
          height="6"
          rx="3"
          fill="#fff"
          opacity="0.6"
        />
        <rect
          x="62"
          y="66"
          width="70"
          height="6"
          rx="3"
          fill="#fff"
          opacity="0.4"
        />
        <rect
          x="62"
          y="100"
          width="88"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="112"
          width="80"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="124"
          width="85"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="136"
          width="75"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="148"
          width="88"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="160"
          width="60"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        {/* Décoration couverture */}
        <rect
          x="62"
          y="195"
          width="88"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.4"
        />
        <rect
          x="62"
          y="207"
          width="60"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        {/* Tranche pages */}
        <rect
          x="166"
          y="14"
          width="6"
          height="232"
          rx="2"
          fill="#e2e8f0"
          opacity="0.8"
        />
        <line
          x1="168"
          y1="20"
          x2="168"
          y2="240"
          stroke="#cbd5e1"
          strokeWidth="0.5"
          opacity="0.6"
        />
        <line
          x1="170"
          y1="20"
          x2="170"
          y2="240"
          stroke="#cbd5e1"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>

      {/* Deuxième livre plus petit à gauche */}
      <svg
        className="absolute -left-10 bottom-10 w-[220px] h-[220px] opacity-[0.035] pointer-events-none select-none rotate-12"
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="30" y="10" width="140" height="240" rx="6" fill="#db2777" />
        <rect x="30" y="10" width="18" height="240" rx="4" fill="#9d174d" />
        <rect
          x="62"
          y="50"
          width="90"
          height="6"
          rx="3"
          fill="#fff"
          opacity="0.6"
        />
        <rect
          x="62"
          y="66"
          width="70"
          height="6"
          rx="3"
          fill="#fff"
          opacity="0.4"
        />
        <rect
          x="62"
          y="100"
          width="88"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="112"
          width="80"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="62"
          y="124"
          width="85"
          height="4"
          rx="2"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="166"
          y="14"
          width="6"
          height="232"
          rx="2"
          fill="#e2e8f0"
          opacity="0.8"
        />
      </svg>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
            Fonctionnalités
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-3">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Une suite complète d'outils conçus pour les lecteurs modernes et les
            gestionnaires exigeants
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const palettes = [
              {
                bg: "bg-violet-50",
                border: "border-violet-100",
                icon: "text-violet-500",
                bar: "from-violet-500 to-violet-300",
                num: "text-violet-200",
              },
              {
                bg: "bg-violet-50",
                border: "border-violet-100",
                icon: "text-violet-500",
                bar: "from-violet-500 to-violet-300",
                num: "text-violet-200",
              },
              {
                bg: "bg-blue-50",
                border: "border-blue-100",
                icon: "text-blue-500",
                bar: "from-blue-500 to-blue-300",
                num: "text-blue-200",
              },
              {
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                icon: "text-emerald-500",
                bar: "from-emerald-500 to-emerald-300",
                num: "text-emerald-200",
              },
              {
                bg: "bg-blue-50",
                border: "border-blue-100",
                icon: "text-blue-500",
                bar: "from-blue-500 to-blue-300",
                num: "text-blue-200",
              },
              {
                bg: "bg-violet-50",
                border: "border-violet-100",
                icon: "text-violet-500",
                bar: "from-violet-500 to-violet-300",
                num: "text-violet-200",
              },
            ];

            const icons = [
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>,
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                />
              </svg>,
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>,
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>,
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>,
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>,
            ];

            const p = palettes[index % palettes.length];
            const icon = icons[index % icons.length];

            return (
              <div
                key={index}
                className={`group relative flex flex-col gap-4 p-5 rounded border ${p.border} ${p.bg} hover:shadow-md transition-all duration-200 overflow-hidden`}
              >
                <span
                  className={`absolute -top-3 -right-1 text-7xl font-black ${p.num} select-none pointer-events-none leading-none`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center bg-white border ${p.border} ${p.icon} shadow-sm shrink-0 relative z-10`}
                >
                  {icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug relative z-10">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1 relative z-10">
                  {feature.description}
                </p>
                <div
                  className={`h-0.5 w-8 rounded-full bg-gradient-to-r ${p.bar} group-hover:w-full transition-all duration-500`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
