import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Check, X, MailOpen, AlertCircle, Loader2 } from "lucide-react";

export default function BooksRetour() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // 1. Groupement des lignes plates de la BDD sous forme de "Tickets" par étudiant
  const formatBorrowsToTickets = (rows) => {
    const grouped = rows.reduce((acc, current) => {
      const userId = current.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          student_name: current.first_name,
          student_lastname: current.last_name,
          student_email: current.email,
          requested_at: current.requested_at,
          books: []
        };
      }
      acc[userId].books.push({
        borrow_id: current.borrow_id,
        book_id: current.book_id,
        title: current.title,
        author: current.author,
        copies_available: current.copies_available
      });
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const fetchTickets = async () => {
    try {
      // Appel vers la nouvelle route backend getPendingReturns
      const res = await api.get("/api/loans/borrows/return-pending");
      const formattedTickets = formatBorrowsToTickets(res.data);
      
      setTickets(formattedTickets);

      // Conserver la sélection de l'étudiant actif après rafraîchissement
      if (selectedTicket) {
        const updated = formattedTickets.find(
          (t) => t.user_id === selectedTicket.user_id
        );
        setSelectedTicket(updated || null);
      }
    } catch (err) {
      console.error("Erreur chargement retours admin :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 2. Logique de décision (Accepter ou Refuser) par livre physique
  const handleReturnDecision = async (borrowId, action) => {
    setIsSubmitting(true);
    try {
      const res = await api.put(`/api/loans/borrows/${borrowId}/return-decision`, { action });

      setToast({
        show: true,
        message: res.data.message || "Opération enregistrée avec succès."
      });

      // Si l'étudiant n'avait qu'un seul livre à rendre, on ferme la vue de droite
      if (selectedTicket && selectedTicket.books.length === 1) {
        setSelectedTicket(null);
      }

      await fetchTickets();

      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 4000);
    } catch (err) {
      console.error("Erreur décision retour :", err);
      alert(err.response?.data?.message || "Erreur lors du traitement de la décision.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Chargement des retours en attente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-manrope flex flex-col">
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-140px)]">
        
        {/* À GAUCHE : Liste des demandes par Étudiant */}
        <div className="w-full md:w-5/12 bg-white border-r border-slate-200 overflow-y-auto divide-y divide-slate-100">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
              <MailOpen className="h-8 w-8 text-slate-300" />
              <span>Boîte de réception vide. Aucun retour en attente.</span>
            </div>
          ) : (
            tickets.map((ticket) => {
              const isCurrent = selectedTicket?.user_id === ticket.user_id;
              return (
                <div
                  key={ticket.user_id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-5 cursor-pointer transition flex justify-between items-start text-left border-l-4 ${
                    isCurrent
                      ? "bg-purple-100 border-purple-600"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="max-w-[75%]">
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {ticket.student_name} {ticket.student_lastname}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                      {ticket.student_email}
                    </p>
                    <span className="inline-flex mt-2 items-center gap-1 text-[11px] font-semibold text-purple-600">
                      Restitutions signalées
                    </span>
                  </div>
                  <span className="bg-slate-900 text-slate-100 text-xs font-bold px-2.5 py-1 rounded shrink-0">
                    {ticket.books.length} {ticket.books.length > 1 ? "livres" : "livre"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* À DROITE : Détail de l'étudiant sélectionné & actions unitaires */}
        <div className="hidden md:flex flex-1 bg-slate-50 overflow-y-auto p-6 flex-col justify-between">
          {selectedTicket ? (
            <div className="rounded p-6 h-full flex flex-col justify-between overflow-hidden">
              <div>
                {/* En-tête profil */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-6">
                  <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center text-white text-lg font-bold tracking-wider shadow-sm">
                    {selectedTicket.student_name.charAt(0).toUpperCase()}
                    {selectedTicket.student_lastname.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedTicket.student_name} {selectedTicket.student_lastname}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedTicket.student_email}
                    </p>
                  </div>
                </div>

                {/* Liste des livres déposés au guichet */}
                <h3 className="text-xs font-bold text-slate-400 mb-4 text-left">
                  Livres à vérifier et intégrer au stock :
                </h3>
                
                <div className="space-y-3 max-y-96 overflow-y-auto pr-1">
                  {selectedTicket.books.map((book) => (
                    <div
                      key={book.borrow_id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-sm text-left hover:border-slate-300 transition duration-150"
                    >
                      <div className="max-w-[65%]">
                        <p className="font-bold text-slate-800 tracking-tight leading-tight">{book.title}</p>
                        <p className="text-xs text-slate-400 mt-1">Par {book.author}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-2 font-mono">
                          Stock actuel : {book.copies_available} dispo.
                        </p>
                      </div>

                      {/* Actions Unitaires de Réception */}
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleReturnDecision(book.borrow_id, "refuse")}
                          className="p-2 bg-white border border-red-200 text-red-600 rounded  hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all duration-150"
                          title="Refuser la réception (Livre manquant ou dégradé)"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleReturnDecision(book.borrow_id, "accepte")}
                          className="p-2 bg-purple-800 text-white rounded hover:bg-purple-600 transition-all duration-150 flex items-center gap-1 text-xs font-semibold px-3 shadow-sm shadow-purple-100"
                          title="Valider la réception physique et réintégrer au stock"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Réceptionner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note d'information réglementaire basse */}
              <div className="border-t border-slate-100 pt-4 mt-6 flex items-center gap-2 text-xs text-slate-400">
                <AlertCircle className="h-4 w-4 text-slate-300 shrink-0" />
                <span>La validation remet instantanément l'exemplaire à disposition des autres étudiants dans le catalogue.</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
              <MailOpen className="h-6 w-6 text-slate-300" />
              <span>Sélectionnez une notification de dépôt pour ouvrir l'espace de vérification.</span>
            </div>
          )}
        </div>
      </div>

      {/* TOAST DE CONFIRMATION */}
      <div
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-4 py-3.5 rounded-xl shadow-2xl transition-all duration-300 transform ${
          toast.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>
        <p className="text-xs font-semibold tracking-wide text-slate-200">
          {toast.message}
        </p>
      </div>
      
    </div>
  );
}