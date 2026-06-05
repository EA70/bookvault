import { Link } from "react-router-dom";
import { BookOpen, History, ShoppingBag } from "lucide-react";

export default function BookHeader({ cartCount, onOpenCart }) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
          Catalogue
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
          Vos prochaines lectures
        </h1>

        <p className="text-sm text-slate-400 font-normal mt-0.5">
          Parcourez et empruntez parmi des milliers d'ouvrages
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/my-loans"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Mes emprunts
        </Link>

        <Link
          to="/my-history"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50"
        >
          <History className="w-3.5 h-3.5" />
          Historique
        </Link>

        <button
          onClick={onOpenCart}
          className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded bg-purple-800 hover:bg-purple-600 text-white text-xs font-semibold"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Mon panier
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-purple-700 text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
