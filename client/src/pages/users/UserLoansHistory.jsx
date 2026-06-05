import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  BookOpen,
  XCircle,
  Clock,
  CheckCircle,
  Search,
  Calendar,
  Layers,
  PieChart,
  Filter
} from "lucide-react";

export default function UserLoansHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/my-history");
      setHistory(data);
    } catch (err) {
      console.error("Erreur historique :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const stats = history.reduce(
    (acc, item) => {
      if (item.status === "refuse") acc.refus++;
      else if (item.status === "emprunte") acc.possession++;
      else if (item.status === "rendu") acc.restitue++;
      else if (item.status === "en_attente_remise" || item.status === "en_attente_retour") acc.attente++;
      acc.total++;
      return acc;
    },
    { refus: 0, possession: 0, restitue: 0, attente: 0, total: 0 }
  );

  const getPercentage = (value) =>
    stats.total === 0 ? 0 : Math.round((value / stats.total) * 100);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "attente" &&
        (item.status === "en_attente_remise" || item.status === "en_attente_retour")) ||
      item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-medium text-slate-400">Chargement de votre historique...</p>
      </div>
    );
  }

  const statItems = [
    { label: "En possession", value: stats.possession, color: "bg-amber-500" },
    { label: "Livres rendus",  value: stats.restitue,  color: "bg-emerald-500" },
    { label: "En attente",     value: stats.attente,   color: "bg-blue-500" },
    { label: "Refusés",        value: stats.refus,     color: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">
              Bibliothèque
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              Mon Historique
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Suivi en temps réel de vos lectures, demandes et restitutions
            </p>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Titre, auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs pl-9 pr-7 py-2.5 bg-white border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="emprunte">En possession</option>
                <option value="rendu">Restitués</option>
                <option value="attente">En attente admin</option>
                <option value="refuse">Refusés</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* Panneau stats — sticky */}
          <div className="space-y-4 lg:sticky lg:top-6">

            {/* Total */}
            <div className="bg-white border border-slate-200 rounded shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Volume total traité
                  </p>
                  <p className="text-3xl font-black text-slate-900 mt-0.5">{stats.total}</p>
                </div>
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-3.5">
                {statItems.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[11px] font-medium mb-1.5">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                        {s.label}
                      </span>
                      <span className="font-bold text-slate-800">
                        {s.value}
                        <span className="text-slate-400 font-normal ml-1">
                          ({getPercentage(s.value)}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${s.color} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${getPercentage(s.value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résultat filtre */}
            <div className="bg-white border border-slate-200 rounded shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Résultats filtrés
                </p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{filteredHistory.length}</p>
              </div>
              <PieChart className="h-5 w-5 text-slate-300" />
            </div>

          </div>

          {/* Tableau historique */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded shadow-sm overflow-hidden">

            {/* Header tableau */}
            <div className="bg-slate-900 px-5 py-4 flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Historique des emprunts</h3>
                <p className="text-[11px] text-slate-400">
                  {filteredHistory.length} entrée{filteredHistory.length > 1 ? "s" : ""} affichée{filteredHistory.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Ouvrage</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Chronologie</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-5 py-12 text-center">
                        <Search className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-medium">Aucun résultat</p>
                        <p className="text-xs text-slate-300 mt-0.5">Essayez d'autres critères de recherche</p>
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => {
                      let statusLabel = "";
                      let statusStyle = "";
                      let timelineDetails = null;

                      switch (item.status) {
                        case "refuse":
                          statusLabel = "Refusé";
                          statusStyle = "bg-rose-50 text-rose-600 border-rose-200";
                          timelineDetails = (
                            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <XCircle className="h-3 w-3 text-rose-400 shrink-0" />
                              Refusé le {formatDateTime(item.returned_at || item.borrowed_at)}
                            </span>
                          );
                          break;
                        case "en_attente_remise":
                          statusLabel = "Demande de prêt";
                          statusStyle = "bg-blue-50 text-blue-600 border-blue-200";
                          timelineDetails = (
                            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Clock className="h-3 w-3 text-blue-400 shrink-0" />
                              Réservé le {formatDateTime(item.borrowed_at)}
                            </span>
                          );
                          break;
                        case "emprunte":
                          statusLabel = "En possession";
                          statusStyle = "bg-amber-50 text-amber-700 border-amber-200";
                          timelineDetails = (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] text-slate-600 font-medium">
                                Pris le {formatDateTime(item.borrowed_at)}
                              </span>
                              <span className="text-[11px] text-rose-500 flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5 shrink-0" />
                                À rendre le {formatDateTime(item.due_at)}
                              </span>
                            </div>
                          );
                          break;
                        case "en_attente_retour":
                          statusLabel = "Dépôt initié";
                          statusStyle = "bg-violet-50 text-violet-600 border-violet-200";
                          timelineDetails = (
                            <span className="flex items-center gap-1.5 text-violet-500 text-[11px] font-medium">
                              <Clock className="h-3 w-3 shrink-0" />
                              Signalé le {formatDateTime(item.return_requested_at)}
                            </span>
                          );
                          break;
                        case "rendu":
                          statusLabel = "Restitué";
                          statusStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                          timelineDetails = (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] text-slate-400">
                                Emprunté le {formatDateTime(item.borrowed_at)}
                              </span>
                              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                <CheckCircle className="h-2.5 w-2.5 shrink-0" />
                                Rendu le {formatDateTime(item.returned_at)}
                              </span>
                            </div>
                          );
                          break;
                        default:
                          statusLabel = item.status;
                          statusStyle = "bg-slate-100 text-slate-600 border-slate-200";
                      }

                      return (
                        <tr key={item.borrow_id} className="hover:bg-slate-50/60 transition-colors duration-150">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center shrink-0">
                                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-[240px]">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                  Par {item.author}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">{timelineDetails}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 border rounded text-[10px] font-semibold tracking-wide ${statusStyle}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}