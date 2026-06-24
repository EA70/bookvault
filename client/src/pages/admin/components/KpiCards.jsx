import React from "react";
import { Link } from "react-router-dom";
import { BookType, HandHelping, AlertTriangle, Users } from "lucide-react";

export default function KpiCards({ kpis }) {
  const cardsData = [
    {
      title: "Total livres",
      value: kpis.totalBooks,
      icon: <BookType className="w-4 h-4 text-blue-600" />,
      bgIcon: "bg-blue-50",
      borderColor: "border-slate-700",
      trend: "catalogue complet",
      path: "/putulu-admin/books",  
      bar: "from-blue-900 to-blue-700",
    },
    {
      title: "Emprunts en cours",
      value: kpis.activeLoans,
      icon: <HandHelping className="w-4 h-4 text-amber-600" />,
      bgIcon: "bg-amber-50",
      borderColor: "border-slate-700",
      trend: "livres en circulation",
      path: "/putulu-admin/loans",  
      bar: "from-amber-900 to-amber-700"
    },
    {
      title: "Retours en retard",
      value: kpis.overdueReturns,
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      bgIcon: "bg-rose-50",
      borderColor: kpis.overdueReturns > 0 ? "border-rose-600" : "border-slate-700",
      isAlert: kpis.overdueReturns > 0,
      trend: kpis.overdueReturns > 0 ? "action requise" : "aucun retard",
      path: "/putulu-admin/overdue-returns",  
      bar: "from-rose-900 to-rose-700"
    },
    {
      title: "Étudiants inscrits",
      value: kpis.totalStudents,
      icon: <Users className="w-4 h-4 text-violet-600" />,
      bgIcon: "bg-violet-50",
      borderColor: "border-slate-700",
      trend: "comptes actifs",
      path: "/putulu-admin/students", 
      bar: "from-violet-900 to-violet-700"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardsData.map((card, idx) => (
        <Link
          key={idx}
          to={card.path}  
          className={` bg-gradient-to-r ${card.bar} border ${card.borderColor} rounded shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-4 block cursor-pointer select-none ${
            card.isAlert ? "ring-1 ring-rose-200 hover:ring-rose-300" : "hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded ${card.bgIcon} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <span className={`text-[12px] font-medium ${card.isAlert ? "text-rose-300" : "text-slate-200"}`}>
              {card.trend}
            </span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-white mt-0.5 uppercase tracking-widest">
              {card.title}
            </p>
            <p className="text-2xl font-black tracking-tight text-white">
              {card.value ?? "—"}
            </p>
          </div>

          {card.isAlert && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-rose-100 mt-auto">
              <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="text-[10px] text-rose-500 font-semibold">
                Action requise
              </span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}