import React from "react";
import { Clock, ShieldAlert } from "lucide-react";

export default function RecentAndOverdueLoans({ actionLists, formatDateTime }) {
  // Dictionnaire interne pour styliser les badges de statut
  const statusStyles = {
    emprunte: "bg-amber-50 text-amber-700 border-amber-200",
    rendu: "bg-emerald-50 text-emerald-700 border-emerald-200",
    en_attente_retour: "bg-blue-50 text-blue-700 border-blue-200",
    en_attente_remise: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
      
      {/* Tableau : Emprunts récents (2/3 de la largeur) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4 lg:col-span-2">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-8 h-8 text-slate-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Emprunts récents</h3>
            <p className="text-[10px] text-slate-400">Les 5 dernières actions d'emprunt enregistrées</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Étudiant</th>
                <th className="pb-3 font-semibold">Livre</th>
                <th className="pb-3 font-semibold">Date Limite</th>
                <th className="pb-3 font-semibold text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {actionLists.recentLoans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-slate-400 italic">
                    Aucun emprunt enregistré
                  </td>
                </tr>
              ) : (
                actionLists.recentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-medium text-slate-800">{loan.student_name}</td>
                    <td className="py-3 text-slate-600 max-w-[180px] truncate">{loan.book_title}</td>
                    <td className="py-3 text-slate-500">
                      {loan.due_at ? formatDateTime(loan.due_at) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border ${statusStyles[loan.status] || "bg-slate-50 text-slate-600"}`}>
                        {loan.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liste : Retours en retard Urgents (1/3 de la largeur) */}
      <div className="bg-white border border-rose-200 rounded shadow-sm p-5 flex flex-col gap-4 bg-gradient-to-b from-white to-rose-50/10">
        <div className="flex items-center gap-2 border-b border-rose-100 pb-3">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Retours en retard</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Actions prioritaires requises</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[17.5rem] pr-1 custom-scrollbar">
          {actionLists.overdueLoans.length === 0 ? (
            <div className="h-full flex items-center justify-center py-8">
              <p className="text-slate-400 text-xs text-center">Aucun retard détecté ..!</p>
            </div>
          ) : (
            actionLists.overdueLoans.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-rose-100 rounded-lg shadow-xs hover:border-rose-200 transition-all">
                <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.student_name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.book_title}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    +{item.days_overdue} j
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