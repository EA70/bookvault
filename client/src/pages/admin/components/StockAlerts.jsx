import React from "react";
import { PackageX, AlertCircle } from "lucide-react";

export default function StockAlerts({ stockAlerts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      
      {/* Colonne Gauche : Ruptures de stock totales */}
      <div className="bg-white border border-rose-100 rounded-xl shadow-sm p-5 flex flex-col gap-4 bg-gradient-to-b from-white to-rose-50/5">
        <div className="flex items-center gap-2 border-b border-rose-50 pb-3">
          <PackageX className="w-8 h-8 text-rose-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Ruptures de stock totales</h3>
            <p className="text-[10px] text-rose-500 font-semibold">0 exemplaire disponible — Emprunts impossibles</p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-50 h-full justify-center">
          {stockAlerts.stockOut.length === 0 ? (
            <p className="text-slate-400  text-center text-xs py-6">
              Parfait, aucun livre n'est en rupture totale ! 
            </p>
          ) : (
            stockAlerts.stockOut.map((book) => (
              <div key={book.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
                    {book.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    par {book.author}
                  </p>
                </div>
                
                <div className="shrink-0 text-right">
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Épuisé ({book.total_copies} ex. au total)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Colonne Droite : Stocks critiques imminents */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <AlertCircle className="w-8 h-8 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Stocks critiques imminents</h3>
            <p className="text-[10px] text-slate-400">Dernier exemplaire disponible avant rupture</p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-50 h-full justify-center">
          {stockAlerts.criticalStock.length === 0 ? (
            <p className="text-slate-400 text-center text-xs py-6">
              Aucune tension sur les stocks actuellement.
            </p>
          ) : (
            stockAlerts.criticalStock.map((book) => (
              <div key={book.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
                    {book.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    par {book.author}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    1 restant sur {book.total_copies}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}