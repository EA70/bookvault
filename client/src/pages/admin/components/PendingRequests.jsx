import React from "react";
import { GitPullRequest, X, Check } from "lucide-react";

export default function PendingRequests({ requests, onAction, formatDateTime }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Demandes de réservation en attente</h3>
            <p className="text-[10px] text-slate-400">Flux de travail opérationnel</p>
          </div>
        </div>
        <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded">
          {requests.length} à traiter
        </span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Étudiant</th>
              <th className="pb-3 font-semibold">Livre demandé</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Stock</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400 ">
                  Aucune demande en attente. 
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-800">{request.student_name}</td>
                  <td className="py-3.5 text-slate-600 font-medium max-w-[220px] truncate">{request.book_title}</td>
                  <td className="py-3.5 text-slate-400">{formatDateTime(request.request_date)}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      request.copies_available > 0 ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {request.copies_available} exemplaires dispos
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onAction(request.id, "reject")}
                        className="p-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAction(request.id, "accept")}
                        disabled={request.copies_available === 0}
                        className={`p-1.5 border rounded transition-all ${
                          request.copies_available > 0
                            ? "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white cursor-pointer"
                            : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}