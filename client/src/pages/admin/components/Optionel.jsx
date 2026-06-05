import React from "react";

export default function Optionel() {
  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mt-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
          Rappel du Flux Logistique de l'Application
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="font-black text-purple-600 block mb-1">
              01. Demande
            </span>
            L'étudiant réserve. Statut{" "}
            <code className="bg-white px-1 py-0.5 rounded border text-[10px]">
              en_attente
            </code>{" "}
            visible sur le <strong>Bloc 5</strong>.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="font-black text-blue-600 block mb-1">
              02. Validation
            </span>
            L'admin valide. Le stock baisse de 1. Statut passe à{" "}
            <code className="bg-white px-1 py-0.5 rounded border text-[10px]">
              emprunte
            </code>
            .
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="font-black text-amber-600 block mb-1">
              03. Contrôle
            </span>
            Suivi de la date limite à J+14. Si dépassée, le système lève une
            alerte sur le <strong>Bloc 3</strong>.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="font-black text-emerald-600 block mb-1">
              04. Clôture
            </span>
            Au retour physique, l'admin clôture. Le stock remonte. Les
            graphiques du <strong>Bloc 2</strong> se mettent à jour.
          </div>
        </div>
      </div>
    </div>
  );
}
