import { useState, useEffect } from "react";
import api from "../../../../services/api"; 
import {
  BookOpen,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function ListeLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Nombre d'emprunts par page

  // Récupération des données depuis l'API Node.js
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/loans/active");
      setLoans(data);
      setCurrentPage(1); // Réinitialise la page lors du rechargement
    } catch (err) {
      console.error("Erreur lors de la récupération des emprunts :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Formatage des dates au format français
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Traitement des filtres (Recherche par étudiant/livre et sélection de statut)
  const filteredLoans = loans.filter((item) => {
    const matchesSearch =
      item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.book_title?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculs liés à la pagination
  const totalItems = filteredLoans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLoans.slice(indexOfFirstItem, indexOfLastItem);

  // Changement de page sécurisé
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-medium text-slate-400">Chargement des flux actifs...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* En-tête de la page */}
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            Suivi des Flux Actifs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
           Suivi en temps réel des emprunts et retours en cours, avec possibilité de filtrer et rechercher selon vos besoins.
          </p>
        </div>

        {/* Barre de Filtres et de Recherche */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 border border-slate-200 rounded shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un étudiant ou un ouvrage..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tous les flux actifs</option>
              <option value="en_attente_remise">Demandes de prêt</option>
              <option value="emprunte">En cours de lecture</option>
              <option value="en_attente_retour">Retours demandés</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Liste des Emprunts sous forme de Grille / Cartes Pro */}
        {currentItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded p-12 text-center shadow-sm">
            <AlertCircle className="h-6 w-6 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">Aucun flux actif trouvé</p>
            <p className="text-xs text-slate-300 mt-0.5">Modifiez vos critères ou attendez de nouvelles actions utilisateurs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentItems.map((item) => {
              // Détermination dynamique des styles selon le statut réel
              let statusLabel = "";
              let statusStyle = "";
              
              switch (item.status) {
                case "en_attente_remise":
                  statusLabel = "Prêt à valider";
                  statusStyle = "bg-indigo-50 text-indigo-600 border-indigo-200";
                  break;
                case "emprunte":
                  statusLabel = "Chez l'étudiant";
                  statusStyle = "bg-amber-50 text-amber-700 border-amber-200";
                  break;
                case "en_attente_retour":
                  statusLabel = "Retour à confirmer";
                  statusStyle = "bg-violet-50 text-violet-600 border-violet-200";
                  break;
                default:
                  statusLabel = item.status;
                  statusStyle = "bg-slate-50 text-slate-600 border-slate-200";
              }

              return (
                <div 
                  key={item.borrow_id} 
                  className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-150"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-800 truncate">
                            {item.book_title}
                          </h3>
                          <p className="text-[10px] text-slate-400 truncate">
                            Emprunteur : {item.student_name}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${statusStyle}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        Initie : {formatDate(item.borrowed_at)}
                      </span>
                      {item.status === "emprunte" && (
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Clock className="h-3 w-3 text-amber-500" />
                          Remise le : {formatDate(item.due_at)}
                        </span>
                      )}
                      {item.status === "en_attente_retour" && (
                        <span className="flex items-center gap-1 text-violet-600 font-medium">
                          <Clock className="h-3 w-3" />
                          Signalé : {formatDate(item.return_rcequested_at)}
                        </span>
                      )}
                    </div>
                  </div>

 
                </div>
              );
            })}
          </div>
        )}

        {/* Bloc de Pagination Pro */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded shadow-sm text-xs">
            <div className="text-slate-400">
              Affichage de <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> sur{" "}
              <span className="font-semibold text-slate-700">{totalItems}</span> demandes
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