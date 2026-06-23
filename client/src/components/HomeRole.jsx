

export default function HomeRole() { 


    return (
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Colonne gauche — citation + stats */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              {/* Citation principale */}
              <div className="relative">
                <svg
                  className="w-10 h-10 text-violet-500/30 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                  Un livre par semaine, c'est 52 nouvelles perspectives par an.
                  La lecture est le seul voyage que l'on peut faire sans quitter
                  sa chaise.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-px bg-violet-500" />
                  <span className="text-xs text-slate-500 font-medium">
                    Francis Bacon
                  </span>
                </div>
              </div>

              {/* Séparateur */}
              <div className="h-px bg-slate-800" />

              {/* Paragraphe */}
              <p className="text-sm text-slate-400 leading-relaxed">
                Dans un monde saturé d'informations éphémères, la lecture
                profonde reste l'un des rares actes qui développe réellement
                l'intelligence critique. Elle forge la capacité à raisonner, à
                argumenter, à comprendre des systèmes complexes — des
                compétences que nul algorithme ne peut remplacer.
              </p>

              {/* Stats horizontales */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    value: "6 min",
                    label: "suffisent à réduire le stress de 68%",
                    color: "text-violet-400",
                  },
                  {
                    value: "2×",
                    label: "plus de vocabulaire en 6 mois de lecture régulière",
                    color: "text-violet-400",
                  },
                  {
                    value: "15 ans",
                    label: "de vie supplémentaires selon certaines études",
                    color: "text-violet-400",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-slate-900 border border-slate-800 rounded p-3 text-center"
                  >
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite — avantages */}
            <div className="w-full lg:w-1/2">
              <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                Pourquoi lire ?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mt-2 mb-4">
                La lecture change{" "}
                <span className="bg-purple-800 bg-clip-text text-transparent">
                  tout.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Chaque livre ouvert est une nouvelle perspective. BuchVault vous
                donne accès à des milliers d'ouvrages pour nourrir votre
                curiosité au quotidien.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  {
                    number: "01",
                    title: "Stimule l'intelligence",
                    desc: "La lecture régulière renforce la mémoire, améliore la concentration et développe la pensée analytique.",
                    accent: "bg-violet-500",
                    text: "text-violet-400",
                  },
                  {
                    number: "02",
                    title: "Enrichit le vocabulaire",
                    desc: "Chaque livre introduit de nouveaux mots et structures de pensée qui améliorent votre communication.",
                    accent: "bg-violet-500",
                    text: "text-violet-400",
                  },
                  {
                    number: "03",
                    title: "Réduit le stress",
                    desc: "6 minutes de lecture suffisent à réduire le stress de 68%. Un refuge accessible partout, à tout moment.",
                    accent: "bg-violet-500",
                    text: "text-violet-400",
                  },
                  {
                    number: "04",
                    title: "Ouvre l'esprit",
                    desc: "Voyager dans d'autres cultures développe l'empathie et la compréhension du monde qui nous entoure.",
                    accent: "bg-violet-500",
                    text: "text-violet-400",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
                  >
                    {/* Barre colorée + numéro */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div
                        className={`w-0.5 h-8 rounded-full ${item.accent}`}
                      />
                      <span className={`text-[10px] font-black ${item.text}`}>
                        {item.number}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="pt-0.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-slate-100 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
            
        )}