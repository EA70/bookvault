


import { useEffect, useState } from "react";
import { Check, X, AlertTriangle, BookOpen } from "lucide-react";

export default function BooksDemande ({ tickets, onDecision, isSubmitting, toast }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  useEffect(() => {
    if (!selectedTicket) return;
    const updated =
      tickets?.find((t) => t.user_id === selectedTicket.user_id) || null;
    setSelectedTicket(updated);
  }, [tickets]);  

  return (
    <div className="min-h-screen bg-slate-100 font-manrope flex flex-col">
      
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-140px)]">
        
        <div className="w-full md:w-5/12 bg-white border-r border-slate-200 overflow-y-auto divide-y divide-slate-100">
          {!tickets?.length ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Boîte de réception vide. 
              Aucune demande d'emprunt en attente.
            </div>
          ) : (
            tickets.map((ticket) => {
              const isCurrent = selectedTicket?.user_id === ticket.user_id;
              return (
                <div
                  key={ticket.user_id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 cursor-pointer transition flex justify-between items-start text-left border-l-4 ${
                    isCurrent
                      ? "bg-purple-100 border-purple-100"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="max-w-[75%]">
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {ticket.student_name} {ticket.student_lastname}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {ticket.student_email}
                    </p>
                    <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded animate-pulse" />
                      En attente de retrait physique
                    </p>
                  </div>
                  <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded shrink-0">
                    {ticket.books?.length ?? 0} {ticket.books?.length > 1 ? "livres" : "livre"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* À DROITE : Détail de la demande sélectionnée (60% de largeur) */}
        <div className="hidden md:flex flex-1 bg-slate-50 overflow-y-auto p-6 flex-col justify-between">
          {selectedTicket ? (
            <div className="  border-slate-200 rounded p-6 h-full flex flex-col justify-between">
              
              {/* Profil de l'Étudiant Demandeur */}
              <div>
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-6">
                  <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {selectedTicket.student_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-slate-800">
                      {selectedTicket.student_name} {selectedTicket.student_lastname}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {selectedTicket.student_email}
                    </p>
                  </div>
                </div>

                {/* Liste des livres demandés par l'étudiant */}
              
                   
             
                <p className="text-sm text-slate-600 mb-5">
                  {selectedTicket.student_name} {selectedTicket.student_lastname} souhaite prendre {selectedTicket.books?.length > 1 ? "les livres" : "le livre"} suivant :
                </p> 
                
                <div className="divide-y divide-slate-100 border border-slate-100 rounded px-4 ">
                  {selectedTicket.books?.map((book) => {
                    const hasStock = book.copies_available > 0;
                    return (
                      <div
                        key={book.borrow_id}
                        className="py-4 flex justify-between items-center text-sm text-left"
                      >
                        <div className="max-w-[60%]">
                          <p className="font-bold text-slate-800">{book.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Par {book.author}</p>
                        </div>

                        {/* Indicateur de stock en temps réel */}
                        <div className="flex items-center gap-3">
                          {hasStock ? (
                            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded border border-emerald-200/50">
                              Stock : {book.copies_available} dispo.
                            </span>
                          ) : (
                            <span className="text-xs bg-rose-50 text-rose-600 font-semibold px-2 py-1 rounded-md border border-rose-200/50 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Rupture !
                            </span>
                          )}

                          {/* Actions individuelles optionnelles par livre */}
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onDecision(book.borrow_id, "refuse")}
                              disabled={isSubmitting}
                              className="p-1.5 rounded border border-red-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition duration-200"
                              title="Refuser ce livre"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDecision(book.borrow_id, "accepte")}
                              disabled={isSubmitting || !hasStock}
                              className="p-1.5 rounded border border-emerald-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition duration-200 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Valider la remise"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rappel de la règle métier */}
                <div className="mt-4 p-3 bg-purple-50 rounded text-purple-800 text-xs flex items-center gap-2">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>La validation de l'emprunt engage l'étudiant pour un retour sous <strong>21 jours maximum</strong>.</span>
                </div>
              </div>

              {/* Actions Globales sur le panier de l'étudiant */}
              <div className="border-t border-slate-100 pt-4 mt-6 flex gap-4">
                <button
                  onClick={() => {
                    // Refuse toutes les requêtes du ticket d'un coup
                    selectedTicket.books.forEach(({ borrow_id }) => onDecision(borrow_id, "refuse"));
                    setSelectedTicket(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs rounded hover:bg-slate-50 active:scale-98 transition disabled:opacity-50"
                >
                  Tout refuser
                </button>
                
                <button
                  onClick={async () => {
                    const validBooks = selectedTicket.books.filter(b => b.copies_available > 0);
                    await Promise.all(validBooks.map(({ borrow_id }) => onDecision(borrow_id, "accepte")));
                    setSelectedTicket(null);
                  }}
                  disabled={isSubmitting || !selectedTicket.books?.some(b => b.copies_available > 0)}
                  className="flex-[2] py-3 bg-purple-800 text-white text-xs rounded hover:bg-purple-600 active:scale-98 transition shadow  shadow-purple-900/10 disabled:opacity-50"
                >
                  {isSubmitting ? "Traitement..." : "Valider et livrer les livres disponibles"}
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
              <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              Sélectionnez un étudiant à gauche pour inspecter sa demande et distribuer ses exemplaires.
            </div>
          )}
        </div>
      </div>

      {/* TOAST DE CONFIRMATION D'ACTIONS */}
      <div
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform ${
          toast?.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
        <p className="text-xs font-semibold tracking-wide text-slate-200">
          {toast?.message}
        </p>
      </div>
    </div>
  );
}