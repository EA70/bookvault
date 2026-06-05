import React from "react";
import { BookOpen, ShieldCheck, Users2, Sparkles, ArrowRight, Library, Milestone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Apropos() {


  const pillars = [
    {
      title: "Gestion d'Inventaire Intelligente",
      description: "Organisez votre catalogue physique et numérique en quelques clics. Suivez l'état de vos stocks, la disponibilité en rayon et l'état d'usure de vos ouvrages."
    },
    {
      title: "Flux de Prêts Sécurisé",
      description: "Fini les livres perdus ou oubliés. Notre système surveille automatiquement les dates de retour, lève des alertes critiques et gère le flux décisionnel de validation."
    },
    {
      title: "Une Communauté Active",
      description: "Permettez à vos étudiants et lecteurs de réserver leurs livres en ligne, de créer des listes de lecture personnalisées et de partager leurs recommandations."
    },
    {
      title: "Analyses & Tendances",
      description: "Visualisez instantanément la santé de votre bibliothèque grâce à nos graphiques natifs : taux de rotation, top des lectures et statistiques démographiques."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen  ">
      
      <div className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
 
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
            Le coffre-fort numérique de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">Savoir</span>.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <strong>BuchVault</strong> n'est pas un simple catalogue en ligne. C'est un écosystème logistique et communautaire complet, conçu pour les passionnés de lecture, les étudiants avides d'apprentissage et les administrateurs soucieux d'une gestion moderne et sans friction.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Pourquoi BuchVault ?</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              La gestion d'une bibliothèque physique souffre souvent d'un manque de visibilité : retards impossibles à suivre, feuilles de calcul Excel surchargées, et étudiants déconnectés de leur catalogue. 
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nous avons bâti BuchVault avec une philosophie claire : <strong>rendre la culture fluide</strong>. En combinant un tableau de bord analytique rigoureux pour les gestionnaires et une interface d'exploration élégante pour les lecteurs, nous redéfinissons la place du livre à l'ère numérique.
            </p>
          </div>
          
          {/* Composant Visuel Abstrait (Simulant une superbe interface/image) */}
          <div className="bg-gradient-to-br from-purple-600 to-red-600 p-1 rounded shadow-xl shadow-purple-100 aspect-video md:aspect-square lg:aspect-video flex items-center justify-center text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
            <div className="text-center z-10 p-6">
              <p className="text-2xl font-black tracking-wider uppercase">BuchVault</p>
              <p className="text-xs text-purple-100 mt-1 font-medium">L'alliance de la logistique et de la lecture</p>
            </div>
            {/* Formes géométriques en décoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-lg" />
          </div>
        </div>


        {/* Grille de fonctionnalités */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Une infrastructure pensée pour l'action</h2>
            <p className="text-xs text-slate-400">Découvrez les modules qui font tourner l'application au quotidien</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded p-5 shadow-xs hover:border-slate-300 transition-all flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{pillar.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LES CHIFFRES CLÉS  */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-3xl font-black text-purple-400">100%</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Web Responsif</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-blue-400">&lt; 2s</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Temps de réponse</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-400">500 Users</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Actifs</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-amber-400">0</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Frisson logistique</p>
          </div>
        </div>

        {/*  SECTION APPEL À L'ACTION (CTA) */}
        <div className="rounded border border-purple-100 p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900">Prêt à réorganiser vos étagères ?</h2>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Que vous soyez un lecteur occasionnel cherchant à suivre ses lectures personnelles ou l'administrateur d'un campus gérant des milliers d'emprunts, BuchVault s'adapte à vos besoins.
          </p>
          <div className="pt-2">
 
            <Link to="/login" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded transition-all shadow-md hover:shadow-lg cursor-pointer">
              Rejoindre l'aventure BuchVault <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}