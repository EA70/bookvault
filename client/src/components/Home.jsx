import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import libraryBg from "../assets/bg.jpg";
import TestimonialsCarousel from "./TestimonialsCarousel";
import FAQ from "./FAQ";
import HomeMarche from "./HomeMarche";
import HomeRole from "./HomeRole";
import HomeStat from "./HomeStat";
import HomeFeat from "./HomeFeat";

export default function Home() {
  
  const { user } = useContext(AuthContext);
  const isConnected = !!user;
  const [randomBooks, setRandomBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  //Recuperation des livres aleatoires
  useEffect(() => {
    const fetchRandomBooks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/books/random");
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

      {/*  Section des livres aleatoires*/}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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

      {/* Features Section */}
      <HomeFeat />

      {/* Stats Section */}
      <HomeStat />

      {/* Comment Ça Marche */}
      <HomeMarche />
      {/* Le role de la lecture */}
      <HomeRole />
      <TestimonialsCarousel />
      {/* CTA Section */}
      <section className="px-4 relative sm:px-6 md:px-8 lg:px-12 py-16 bg-slate-50 sm:py-24 md:py-32 overflow-hidden">

        {/* Livre ouvert — décoratif centré en fond */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.045] pointer-events-none select-none"
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Page gauche */}
          <path d="M150 30 Q100 25 20 40 L20 175 Q90 160 150 170 Z" fill="#7c3aed"/>
          {/* Page droite */}
          <path d="M150 30 Q200 25 280 40 L280 175 Q210 160 150 170 Z" fill="#6d28d9"/>
          {/* Spine central */}
          <path d="M150 28 L150 172" stroke="#4c1d95" strokeWidth="3"/>
          {/* Lignes texte page gauche */}
          <line x1="40" y1="65"  x2="138" y2="60"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="40" y1="78"  x2="135" y2="73"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="40" y1="91"  x2="138" y2="86"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="40" y1="104" x2="130" y2="99"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="40" y1="117" x2="136" y2="112" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="40" y1="130" x2="125" y2="125" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="40" y1="143" x2="134" y2="138" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.25"/>
          {/* Lignes texte page droite */}
          <line x1="162" y1="60"  x2="258" y2="65"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="162" y1="73"  x2="255" y2="78"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="162" y1="86"  x2="258" y2="91"  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="162" y1="99"  x2="250" y2="104" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="162" y1="112" x2="256" y2="117" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="162" y1="125" x2="245" y2="130" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
          <line x1="162" y1="138" x2="254" y2="143" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.25"/>
          {/* Ombre sous le livre */}
          <ellipse cx="150" cy="182" rx="110" ry="8" fill="#4c1d95" opacity="0.3"/>
        </svg>

        {/* Petits livres empilés à gauche */}
        <svg
          className="absolute -left-8 bottom-8 w-[180px] h-[180px] opacity-[0.04] pointer-events-none select-none -rotate-6"
          viewBox="0 0 200 260"
          fill="none"
        >
          <rect x="30" y="10" width="140" height="240" rx="6" fill="#db2777"/>
          <rect x="30" y="10" width="18" height="240" rx="4" fill="#9d174d"/>
          <rect x="62" y="50" width="90" height="6" rx="3" fill="#fff" opacity="0.6"/>
          <rect x="62" y="66" width="70" height="6" rx="3" fill="#fff" opacity="0.4"/>
          <rect x="62" y="100" width="88" height="4" rx="2" fill="#fff" opacity="0.3"/>
          <rect x="62" y="112" width="80" height="4" rx="2" fill="#fff" opacity="0.3"/>
          <rect x="166" y="14" width="6" height="232" rx="2" fill="#e2e8f0" opacity="0.5"/>
        </svg>

        {/* Petit livre à droite en haut */}
        <svg
          className="absolute -right-6 top-8 w-[140px] h-[140px] opacity-[0.04] pointer-events-none select-none rotate-12"
          viewBox="0 0 200 260"
          fill="none"
        >
          <rect x="30" y="10" width="140" height="240" rx="6" fill="#7c3aed"/>
          <rect x="30" y="10" width="18" height="240" rx="4" fill="#5b21b6"/>
          <rect x="62" y="50" width="90" height="6" rx="3" fill="#fff" opacity="0.6"/>
          <rect x="62" y="66" width="70" height="6" rx="3" fill="#fff" opacity="0.4"/>
          <rect x="62" y="100" width="88" height="4" rx="2" fill="#fff" opacity="0.3"/>
          <rect x="62" y="112" width="80" height="4" rx="2" fill="#fff" opacity="0.3"/>
          <rect x="166" y="14" width="6" height="232" rx="2" fill="#e2e8f0" opacity="0.5"/>
        </svg>

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
            Rejoignez-nous
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-4">
            Prêt à découvrir votre prochain{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              chef-d'œuvre ?
            </span>
          </h2>

          <p className="text-sm text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Rejoignez des milliers de lecteurs qui utilisent BuchVault pour transformer leur façon de lire et de découvrir les livres.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/registration"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-semibold transition-all duration-200 shadow-sm shadow-violet-200"
                >
                  Créer un compte gratuit
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  Se connecter
                </Link>
              </>
            ) : (
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-semibold transition-all duration-200 shadow-sm shadow-violet-200"
              >
                Consulter le catalogue
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>

        </div>
      </section>

      <FAQ />
    </div>
  );
}
