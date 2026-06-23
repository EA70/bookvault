import React from "react";
import { BookOpen, ShieldCheck, Users2, Sparkles, ArrowRight, Library, Milestone } from "lucide-react";
import { Link } from "react-router-dom";
import img from "../assets/Foto.jpg"
import ill from "../assets/vif.png"

export default function Apropos() {

 
  const stack = [
    { label: "Frontend", value: "React · Tailwind CSS" },
    { label: "Backend", value: "Node.js · Express" },
    { label: "Base de données", value: "PostgreSQL" },
    { label: "Architecture", value: "MVC · REST API" },
  ];
  return (
    <div className="min-h-screen">
      
      <div className="relative overflow-hidden bg-white py-16 sm:py-24">

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
 
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
            Le coffre-fort numérique de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">Savoir</span>.
          </h1>
          <p className="mt-6 text-base  text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-purple-800">BuchVault</strong> n'est pas un simple catalogue en ligne. C'est un écosystème logistique et communautaire complet, conçu pour les passionnés de lecture, les étudiants avides d'apprentissage et les administrateurs soucieux d'une gestion moderne et sans friction.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading">
              La gestion d'une bibliothèque physique souffre souvent d'un manque de visibilité : retards impossibles à suivre, feuilles de calcul Excel surchargées, et étudiants déconnectés de leur catalogue. 
            </p>
            <p className="text-sm text-slate-600 ">
              Nous avons bâti BuchVault avec une philosophie claire : <strong>rendre la culture fluide</strong>. En combinant un tableau de bord analytique rigoureux pour les gestionnaires et une interface d'exploration élégante pour les lecteurs, nous redéfinissons la place du livre à l'ère numérique.
            </p>
          </div>
          
          {/* Composant Visuel Abstrait (Simulant une superbe interface/image) */}
          <div className="">
            <img src={ill} alt="" />
          </div>
        </div>


        {/* LES CHIFFRES CLÉS  */}
        <div className="bg-slate-50 text-slate-900 rounded p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative overflow-hidden">
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
        <div className="rounded  p-8 sm:p-12 text-center space-y-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900">Prêt à réorganiser vos étagères ?</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Que vous soyez un lecteur occasionnel cherchant à suivre ses lectures personnelles ou l'administrateur d'un campus gérant des milliers d'emprunts, BuchVault s'adapte à vos besoins.
          </p>
          <div className="pt-2">
 
            <Link to="/login" className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-600 text-white font-bold text-xs px-6 py-3 rounded transition-all shadow-md hover:shadow-lg cursor-pointer">
              Rejoindre l'aventure BuchVault <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/*  SECTION DEVELOPPEUR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Photo + liens */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <img
                src={img}
                alt="Développeur"
                className="w-40 h-40 object-cover rounded shadow"
              />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black">Mando Elie</h3>
              <p className="text-xs text-slate-700 mt-0.5">Développeur Full-Stack</p>
            </div>

            {/* Stack */}
            <div className="w-full rounded p-4 space-y-2.5">
              <p className="text-[10px] font-semibold text-center text-slate-500 uppercase tracking-widest mb-3">
                Stack technique
              </p>
              {stack.map((item) => (
                <div key={item.label} className="flex items-center justify-around text-xs">
                  <span className="text-slate-700 ">{item.label}</span>
                  <span className="text-slate-700 ">{item.value}</span>
                </div>
              ))}
            </div>

  
          </div>

          {/* Description développeur */}
          <div className="space-y-4">
            <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
              Le développeur
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Derrière BuchVault
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Passionné par le développement web et l'expérience utilisateur, j'ai conçu BuchVault comme un projet complet de A à Z — de la conception de la base de données PostgreSQL jusqu'au déploiement de l'interface React.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              L'objectif était clair : créer une application de bibliothèque numérique qui soit à la fois fonctionnelle pour un administrateur et agréable à utiliser pour un étudiant. Chaque composant a été pensé pour allier performance, lisibilité du code et qualité du design.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ce projet reflète mon approche du développement moderne : une architecture MVC propre côté serveur, une UI cohérente et un système de gestion des rôles robuste. BuchVault est ma démonstration que la technique et le design peuvent coexister sans compromis.
            </p>

            {/* Citation */}
            <div className="mt-6 border-l-2 border-violet-500 pl-4">
              <p className="text-sm text-slate-900 italic leading-relaxed">
                "Un bon code se lit comme une bonne prose — clair, précis, et sans ambiguïté."
              </p>
              <p className="text-xs text-slate-500 mt-2 font-medium">— Mando Elie, Développeur BuchVault</p>
            </div>
          </div>

    

      </div>
      </div>
    </div>
  );
}