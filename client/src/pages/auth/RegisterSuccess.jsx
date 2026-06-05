

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function RegisterSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // SÉCURITÉ ABSOLUE : Si l'état secret n'est pas présent, on redirige vers l'inscription
  const isVerified = location.state?.fromRegister;

  useEffect(() => {
    if (!isVerified) {
      navigate("/register", { replace: true });
    }
  }, [isVerified, navigate]);

  // Si l'accès est frauduleux, on affiche un écran blanc le temps que le useEffect redirige
  if (!isVerified) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-manrope relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10"></div>
      <div className="max-w-md w-full  p-8 sm:p-10 text-center relative z-10 flex flex-col items-center justify-center ">
        {/* Titre de remerciement */}
        <h1 className="text-xl sm:text-2xl font-bold text-purple-800 tracking-tight my-6">
          Compte créé avec succès
        </h1>

        {/* Message épuré */}
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-xs">
          Merci d'avoir rejoint <span className="font-bold text-purple-900">BuchVault</span>. Enfin de pouvoir réserver des livres en ligne, veuillez consulter votre email pour activer votre compte. 
        </p>

        <Link
          to="/login"
          className="w-full py-3 px-4 bg-purple-800 text-white font-semibold text-sm rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition flex items-center justify-center gap-2 group cursor-pointer shadow-sm"
        >
          <span>Se connecter à l'espace</span>
        </Link>

        <div className="w-full h-px bg-slate-100 my-6"></div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Un problème ?</span>
          <a href="mailto:eliekoyabanda@gmail.com" className="text-purple-600 hover:text-slate-900 underline underline-offset-2 transition">
            Contacter l'assistance
          </a>
        </div>
      </div>
    </div>
  );
}