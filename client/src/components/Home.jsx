import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import libraryBg from "../assets/bg.jpg";

export default function Home() {
  const { user } = useContext(AuthContext);
  const isConnected = !!user;

  const [randomBooks, setRandomBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

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

  //Recuperation des livres aleatoires
  useEffect(() => {
    const fetchRandomBooks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/books/random");
        // On attend un tableau de 6 livres du backend
        setRandomBooks(response.data);
        setError(false);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des livres aléatoires :",
          err,
        );
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-20 sm:py-28 md:py-36 lg:py-44">
        {/* Image de fond */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${libraryBg})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 -z-10 bg-slate-900/75" />
        <div className="max-w-5xl mx-auto text-center">
          {/* Label eyebrow */}
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300  tracking-widest mb-6">
            <span className="w-6 h-px bg-purple-400 inline-block"></span>
            Votre Bibliothèque numérique
            <span className="w-6 h-px bg-purple-400 inline-block"></span>
          </span>

          {/* Titre principal */}
          <h1 className=" font-text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            La bibliothèque de{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                demain
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"></span>
            </span>
            {", "}aujourd'hui.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            Découvrez, empruntez et gérez vos ouvrages en quelques clics.
            BuchVault centralise l'intégralité du catalogue de votre
            établissement et vous donne accès à des milliers de ressources
            numériques.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {user?.first_name ? (
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-7 py-3 rounded bg-purple-800 text-white text-sm font-semibold hover:bg-purple-600 active:scale-95 transition-all duration-200"
              >
                Accéder à ma bibliothèque
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded bg-purple-800 text-white text-sm font-semibold hover:bg-purple-600 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-900/40"
                >
                  Commencer maintenant
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/registration"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200"
                >
                  Créer un compte étudiant
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <p className="mt-8 text-xs text-slate-400 font-medium">
            Réservation instantanée · Retours simplifiés
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Fonctionnalités principales
            </h2>
            <p className="font-manrope text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-2">
              Une suite complète d'outils conçus pour les lecteurs modernes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col p-6 sm:p-8 rounded border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white group"
              >
                <h3 className="font-satoshi text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="font-manrope text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Section des livres aleatoires*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* En-tête de la section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* 1. Label discret en premier — contextualise */}
          <span className="inline-block text-xs font-semibold text-purple-500 uppercase tracking-widest mb-3">
            Catalogue
          </span>

          {/* 2. Titre principal — hiérarchie claire */}
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Explorez des milliers d'ouvrages
          </h2>

          {/* 3. Description — sobre, pas en gras */}
          <p className="mt-4 text-sm text-slate-500 leading-relaxed font-normal max-w-lg mx-auto">
            Un échantillon aléatoire de notre bibliothèque numérique.
            Connectez-vous pour accéder à l'intégralité du catalogue et réserver
            vos prochains livres.
          </p>
        </div>

        {/*  ÉTAT : CHARGEMENT  */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-slate-100 rounded-xl p-5 space-y-4 animate-pulse"
              >
                <div className="h-48 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* ÉTAT : ERREUR DE L'API */}
        {!isLoading && error && (
          <div className="text-center p-12 bg-slate-50 rounded border border-dashed border-slate-200 max-w-md mx-auto">
            <p className="mt-2 text-sm font-medium text-slate-600">
              Impossible de charger l'aperçu pour le moment.
            </p>
          </div>
        )}

        {/* AFFICHAGE DES 6 LIVRES */}
        {!isLoading && !error && (
          <div className="relative">
            {/* Grille de livres — Responsive et dynamique */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${!isConnected ? "pb-40" : "pb-12"}`}
            >
              {randomBooks.map((book) => (
                <div
                  key={book.id}
                  className="group bg-white border border-slate-100 overflow-hidden hover:border-slate-200 transition duration-300 flex flex-col shadow-sm hover:shadow-md"
                >
                  {/* Couverture */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-90"
                    />
                    {/* Badge catégorie */}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-white/80 backdrop-blur-sm text-slate-700 border border-white/60">
                      {book.category_name || "Général"}
                    </span>
                    {/* Badge dispo */}
                    <span
                      className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm border border-white/30
                      ${
                        book.copies_available > 0
                          ? "bg-emerald-500/80 text-white"
                          : "bg-rose-500/80 text-white"
                      }`}
                    >
                      {book.copies_available > 0
                        ? `${book.copies_available} dispo`
                        : "Épuisé"}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-purple-600 transition">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">
                      par {book.author}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-3 flex-1">
                      {book.description}
                    </p>

                    {/* CONDITION VERROU : Affiché UNIQUEMENT si non connecté */}
                    {!isConnected && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 animate-fade-in">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M5 10.5h14a1 1 0 011 1V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-7.5a1 1 0 011-1z"
                          />
                        </svg>
                        <span>Connectez-vous pour emprunter ce livre</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* RENDU CONDITIONNEL DU BAS DE PAGE */}
            {!isConnected ? (
              /*ÉCRAN INVITATION (Utilisateur non connecté) */
              <div className="absolute -bottom-4 left-0 right-0 h-72 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end pb-4">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded border border-slate-200/60 shadow-xl max-w-lg w-full text-center flex flex-col items-center justify-center">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                    Envie d'explorer les milliers d'autres livres ?
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-1 max-w-sm">
                    Les étudiants connectés ont un accès illimité à
                    l'intégralité du catalogue, à la réservation instantanée et
                    à la gestion des retours.
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <Link
                      to="/login"
                      className="py-2.5 px-5 bg-purple-800 text-white text-xs font-bold rounded hover:bg-purple-600 transition shadow-sm text-center"
                    >
                      Se connecter à l'espace
                    </Link>
                    <Link
                      to="/registration"
                      className="py-2.5 px-5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition text-center"
                    >
                      Créer un compte étudiant
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* BOUTON SENIOR "VOIR PLUS" (Utilisateur connecté) */
              <div className="flex justify-center mt-12 animate-fade-in">
                <Link
                  to="/book"
                  className="group inline-flex items-center gap-2 py-3.5 px-8 bg-purple-800 text-white font-semibold text-sm rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                >
                  <span>Explorer tout le catalogue numérique</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { label: "Utilisateurs actifs", value: "100+" },
              { label: "Livres catalogués", value: "500+" },
              { label: "Taux de satisfaction", value: "98%" },
            ].map((stat, index) => (
              <div key={index} className="text-center px-2">
                <p className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="font-manrope text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment Ça Marche */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto">
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
              {/* Image */}
              <div className="w-full md:w-1/2 rounded overflow-hidden bg-slate-100 aspect-video flex items-center justify-center shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
                  alt="Créer un compte"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Texte */}
              <div className="w-full md:w-1/2">
                <span className="inline-block text-xs font-black text-violet-500 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded mb-4 tracking-widest">
                  ÉTAPE 01
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                  Créer un compte
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Inscrivez-vous en quelques secondes avec vos informations.
                  Votre espace personnel est créé instantanément et sécurisé par
                  jeton d'authentification.
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
              {/* Image */}
              <div className="w-full md:w-1/2 rounded overflow-hidden bg-slate-100 aspect-video flex items-center justify-center shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80"
                  alt="Ajouter vos livres"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Texte */}
              <div className="w-full md:w-1/2">
                <span className="inline-block text-xs font-black text-pink-500 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded mb-4 tracking-widest">
                  ÉTAPE 02
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                  Parcourez le catalogue
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Explorez des milliers d'ouvrages classés par catégorie.
                  Filtrez par auteur, genre ou disponibilité et ajoutez vos
                  sélections à votre panier d'emprunt.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Disponible immédiatement
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Réservation possible
                  </div>
                </div>
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
              {/* Image */}
              <div className="w-full md:w-1/2 rounded overflow-hidden bg-slate-100 aspect-video flex items-center justify-center shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
                  alt="Gérer et découvrir"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Texte */}
              <div className="w-full md:w-1/2">
                <span className="inline-block text-xs font-black text-violet-500 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded mb-4 tracking-widest">
                  ÉTAPE 03
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                  Gérez vos emprunts
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Suivez vos emprunts en temps réel depuis votre espace
                  personnel. Consultez l'historique complet de vos lectures et
                  gérez vos retours facilement.
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
                  
      {/* Le role de la lecture */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 bg-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* SVG Vector — personnage qui lit */}
            <div className="w-full lg:w-1/2 flex items-center justify-center shrink-0"></div>

            {/* Contenu texte */}
            <div className="w-full lg:w-1/2">
              <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                Pourquoi lire ?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mt-2 mb-4">
                La lecture change{" "}
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  tout.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-10">
                Chaque livre ouvert est une nouvelle perspective. BuchVault vous
                donne accès à des milliers d'ouvrages pour nourrir votre
                curiosité au quotidien.
              </p>

              <div className="flex flex-col gap-5"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-24 md:py-32 bg-gradient-to-r from-purple-600 to-red-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Prêt à découvrir votre prochain chef-d'œuvre ?
          </h2>
          <p className="font-manrope text-base sm:text-lg text-purple-100 mb-8 max-w-2xl mx-auto px-2">
            Rejoignez des milliers de lecteurs qui utilisent bookVault pour
            transformer leur façon de lire et de découvrir les livres.
          </p>
          {!user ? (
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded bg-white text-purple-600 font-satoshi font-semibold hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 text-sm sm:text-base"
            >
              Créer un compte gratuit
            </Link>
          ) : (
            <Link
              to="/books"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded bg-white text-purple-600 font-satoshi font-semibold hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 text-sm sm:text-base"
            >
              Consultez notre catalogue
            </Link>
          )}
        </div>
      </section>
      
    </div>
  );
}
