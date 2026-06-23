export default function HomeMarche() {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
            Fonctionnement
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Comment ça marche
          </h2>
        </div>

        <div className="flex flex-col gap-16 sm:gap-24">
          {/* Étape 01 — image gauche, texte droite */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Vecteur Humain Étape 01: Création de compte */}
            <div className="w-full md:w-1/2 rounded overflow-hidden bg-violet-50/50 aspect-video flex items-center justify-center shrink-0 p-6">
              <svg
                className="w-full h-full max-h-[190px]"
                viewBox="0 0 220 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Personnage assis devant un écran géant */}
                <circle cx="65" cy="55" r="15" fill="#DDD6FE" /> {/* Tête */}
                <path
                  d="M65 70C45 70 35 85 35 105H95C95 85 85 70 65 70Z"
                  fill="#8B5CF6"
                />{" "}
                {/* Corps violet */}
                <rect
                  x="55"
                  y="90"
                  width="20"
                  height="25"
                  rx="5"
                  fill="#F1F5F9"
                />{" "}
                {/* Bureau partiel */}
                {/* Grand écran de formulaire */}
                <rect
                  x="110"
                  y="20"
                  width="90"
                  height="90"
                  rx="10"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                />
                <rect
                  x="110"
                  y="20"
                  width="90"
                  height="20"
                  rx="10"
                  fill="#F5F3FF"
                />
                <rect
                  x="125"
                  y="55"
                  width="60"
                  height="8"
                  rx="4"
                  fill="#E2E8F0"
                />{" "}
                {/* Champ 1 */}
                <rect
                  x="125"
                  y="70"
                  width="60"
                  height="8"
                  rx="4"
                  fill="#E2E8F0"
                />{" "}
                {/* Champ 2 */}
                <rect
                  x="135"
                  y="90"
                  width="40"
                  height="10"
                  rx="5"
                  fill="#8B5CF6"
                />{" "}
                {/* Bouton */}
                {/* Éléments flottants/décoratifs */}
                <circle cx="195" cy="35" r="5" fill="#DDD6FE" />
                <path
                  d="M30 30L40 40M40 30L30 40"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {/* Texte */}
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-700 tracking-tight mb-3">
                Créer un compte
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Inscrivez-vous en quelques secondes avec vos informations. Votre
                espace personnel est créé instantanément et sécurisé par jeton
                d'authentification.
              </p>
              <div className="mt-6">
                <a
                  href="/registration"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all duration-200 active:scale-95"
                >
                  S'inscrire gratuitement
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-300" />
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Étape 02 — texte gauche, image droite */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            {/* Vecteur Humain Étape 02: Catalogue / Recherche */}
            <div className="w-full md:w-1/2 rounded overflow-hidden bg-violet-50/50 aspect-video flex items-center justify-center shrink-0 p-6">
              <svg
                className="w-full h-full max-h-[190px]"
                viewBox="0 0 220 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Personnage debout interagissant avec une étagère virtuelle */}
                <circle cx="150" cy="50" r="12" fill="#8B5CF6" />{" "}
                {/* Tête violette */}
                <path
                  d="M150 62C135 62 128 75 128 90V110H172V90C172 75 165 62 150 62Z"
                  fill="#DDD6FE"
                />{" "}
                {/* Corps gris-violet */}
                <path
                  d="M135 85L120 75M135 95L120 105"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />{" "}
                {/* Bras gauche */}
                {/* Étagère virtuelle/Catalogue flottant */}
                <rect
                  x="30"
                  y="25"
                  width="80"
                  height="15"
                  rx="4"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />{" "}
                {/* Catégorie */}
                <rect
                  x="40"
                  y="50"
                  width="20"
                  height="30"
                  rx="2"
                  fill="#8B5CF6"
                />{" "}
                {/* Livre 1 */}
                <rect
                  x="65"
                  y="45"
                  width="20"
                  height="35"
                  rx="2"
                  fill="#F5F3FF"
                  stroke="#8B5CF6"
                  strokeWidth="1.5"
                />{" "}
                {/* Livre 2 focus */}
                <rect
                  x="90"
                  y="55"
                  width="20"
                  height="25"
                  rx="2"
                  fill="#DDD6FE"
                />{" "}
                {/* Livre 3 */}
                <rect
                  x="30"
                  y="90"
                  width="80"
                  height="15"
                  rx="4"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />{" "}
                {/* Résultats */}
                {/* Loupe géante */}
                <circle
                  cx="75"
                  cy="62"
                  r="18"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  fill="white"
                  fillOpacity="0.6"
                />
                <line
                  x1="88"
                  y1="75"
                  x2="98"
                  y2="85"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {/* Texte */}
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-700 tracking-tight mb-3">
                Parcourez le catalogue
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Explorez des milliers d'ouvrages classés par catégorie. Filtrez
                par auteur, genre ou disponibilité et ajoutez vos sélections à
                votre panier d'emprunt.
              </p>
            </div>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Étape 03 — image gauche, texte droite */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Vecteur Humain Étape 03: Dashboard / Gestion */}
            <div className="w-full md:w-1/2 rounded overflow-hidden bg-violet-50/50 aspect-video flex items-center justify-center shrink-0 p-6">
              <svg
                className="w-full h-full max-h-[190px]"
                viewBox="0 0 220 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Personnage volant/flottant organisant des éléments de dashboard */}
                <circle cx="140" cy="50" r="14" fill="#DDD6FE" /> {/* Tête */}
                <path
                  d="M140 64C120 64 110 75 110 90L130 115H150L170 90C170 75 160 64 140 64Z"
                  fill="#8B5CF6"
                />{" "}
                {/* Corps violet dynamique */}
                <path
                  d="M120 75L100 65M160 75L180 65"
                  stroke="#DDD6FE"
                  strokeWidth="2"
                  strokeLinecap="round"
                />{" "}
                {/* Bras tendus */}
                {/* Éléments de dashboard flottants */}
                <rect
                  x="40"
                  y="20"
                  width="50"
                  height="35"
                  rx="8"
                  fill="white"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />{" "}
                {/* Stat Card 1 */}
                <rect
                  x="50"
                  y="30"
                  width="30"
                  height="6"
                  rx="3"
                  fill="#DDD6FE"
                />
                <rect
                  x="50"
                  y="40"
                  width="20"
                  height="6"
                  rx="3"
                  fill="#8B5CF6"
                />
                <rect
                  x="40"
                  y="65"
                  width="50"
                  height="45"
                  rx="8"
                  fill="#F5F3FF"
                />{" "}
                {/* Stat Card 2 (Pink/Violet gradient implied by context) */}
                <circle
                  cx="65"
                  cy="87"
                  r="12"
                  stroke="#F472B6"
                  strokeWidth="2.5"
                  fill="white"
                />{" "}
                {/* Petit graphe camembert */}
                <path
                  d="M65 87L71 81"
                  stroke="#F472B6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <rect
                  x="100"
                  y="35"
                  width="40"
                  height="20"
                  rx="10"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />{" "}
                {/* Item géré 1 */}
                <rect
                  x="150"
                  y="25"
                  width="40"
                  height="20"
                  rx="10"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />{" "}
                {/* Item géré 2 */}
              </svg>
            </div>
            {/* Texte */}
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-700 tracking-tight mb-3">
                Gerez vos emprunts
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Suivez vos emprunts en temps réel depuis votre espace personnel.
                Consultez l'historique complet de vos lectures et gerez vos
                retours facilement.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {[
                  "Suivi des dates de retour",
                  "Historique complet",
                  "Notifications de retard",
                ].map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2 text-xs text-slate-600 font-medium"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-violet-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
