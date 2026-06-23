import { useState, useEffect } from "react";
import api from "../../../../services/api"; 

import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Mail,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react";

export default function ListeRetard() {
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendingEmailId, setSendingEmailId] = useState(null);
  const [emailStatus, setEmailStatus] = useState({}); // Suit le statut d'envoi par ligne
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Nombre de retards affichés par page

  // Récupération des retards depuis l'API Node.js
  const fetchOverdueLoans = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/loans/overdue"); // Appelle votre contrôleur getAllOverdueLoans
      setOverdueLoans(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erreur lors de la récupération des retards :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueLoans();
  }, []);

  // Fonction pour déclencher l'envoi du mail de relance via le backend
const handleSendReminder = async (borrowId) => {
  try {
    // 1. On active le chargement pour cette ligne précise
    setSendingEmailId(borrowId);
    
    // 2. Appel POST vers Node.js avec le payload attendu (borrowId)
    const { data } = await api.post("/api/remind", { borrowId });
    
    // 3. Si l'envoi réussit, on met à jour l'état visuel
    setEmailStatus(prev => ({ ...prev, [borrowId]: "sent" }));

    // 4. Optionnel : Mettre à jour localement la liste pour afficher la date de relance à jour
    setOverdueLoans(prevLoans => 
      prevLoans.map(loan => 
        loan.borrow_id === borrowId 
          ? { ...loan, last_reminded_at: data.lastRemindedAt || new Date() }
          : loan
      )
    );
    
    // Réinitialisation du badge de succès après 4 secondes
    setTimeout(() => {
      setEmailStatus(prev => ({ ...prev, [borrowId]: null }));
    }, 4000);

  } catch (err) {
    console.error("Erreur lors de l'envoi de la relance :", err);
    
    // Gestion de l'erreur anti-spam (429) ou technique (500)
    setEmailStatus(prev => ({ ...prev, [borrowId]: "error" }));
    
    // Optionnel : afficher l'erreur exacte du serveur dans la console ou une notification
    const errorMessage = err.response?.data?.message || "Erreur de connexion au serveur";
    alert(errorMessage); 
  } finally {
    // 5. On coupe le chargement dans tous les cas
    setSendingEmailId(null);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filtrage par nom d'étudiant ou titre de livre
  const filteredOverdue = overdueLoans.filter((item) =>
    item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.book_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculs de pagination
  const totalItems = filteredOverdue.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOverdue.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-medium text-slate-400">Analyse des retours hors délais...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-widest">
              Alertes Critiques
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              Retards de Restitution
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Liste des ouvrages dont la date d'échéance est dépassée. Relancez les étudiants par e-mail.
            </p>
          </div>
          
          {/* Badge du volume total de retards */}
          <div className="bg-rose-50 border border-rose-100 rounded px-3 py-2 text-center self-start sm:self-center">
            <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wide">Total Hors Délais</span>
            <span className="text-xl font-black text-rose-600">{overdueLoans.length}</span>
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un étudiant ou un livre en retard..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Grille des retards */}
        {currentItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded p-12 text-center shadow-sm">
            <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">Aucun retard détecté</p>
            <p className="text-xs text-slate-300 mt-0.5">Tous les livres en possession respectent les délais impartis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentItems.map((item) => {
              const isSending = sendingEmailId === item.borrow_id;
              const status = emailStatus[item.borrow_id];

              return (
                <div 
                  key={item.borrow_id} 
                  className="bg-white border-l-4 border-l-rose-500 border-y border-r border-slate-200 rounded-r rounded-l-none p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-150"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-800 truncate">
                            {item.book_title}
                          </h3>
                          <p className="text-[10px] text-slate-500 truncate font-medium">
                            Étudiant : {item.student_name}
                          </p>
                        </div>
                      </div>
                      
                      {/* Badge indiquant l'importance du retard */}
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <AlertTriangle className="h-2.5 w-2.5 text-rose-500" />
                        + {item.days_overdue} Jours
                      </span>
                    </div>

                    {/* Chronologie des dates */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Emprunté le : {formatDate(item.borrowed_at)}
                      </span>
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <Clock className="h-3 w-3" />
                        Échéance : {formatDate(item.due_at)}
                      </span>
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <Clock className="h-3 w-3" />
                        Dernière relance : {item.last_reminded_at ? formatDate(item.last_reminded_at) : "Non envoyée"}
                      </span>
                    </div>
                  </div>

                  {/* Section action d'envoi de mail */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end items-center">
                    {status === "sent" ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 animate-fade-in">
                        <CheckCircle className="h-3 w-3" /> Relance envoyée
                      </span>
                    ) : status === "error" ? (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                        Échec de l'envoi
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendReminder(item.borrow_id)}
                        disabled={isSending}
                        className="text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 px-3 py-1.5 rounded flex items-center gap-1.5 transition duration-150 disabled:cursor-not-allowed"
                      >
                        <Mail className={`h-3 w-3 ${isSending ? "animate-pulse" : ""}`} />
                        {isSending ? "Envoi..." : "Relancer par mail"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded shadow-sm text-xs">
            <div className="text-slate-400">
              Affichage de <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> sur{" "}
              <span className="font-semibold text-slate-700">{totalItems}</span> retards constatés
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              
              <div className="px-3 py-1 font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded">
                Page {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}