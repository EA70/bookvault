import { useState, useEffect } from "react";
import api from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Users() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Chargement de tous les utilisateurs
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/all-users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else if (response.data && Array.isArray(response.data.students)) {
          setStudents(response.data.students);
        }
        setError(false);
      } catch (err) {
        console.error("Erreur récupération étudiants :", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Charger l'historique des emprunts quand un étudiant est sélectionné
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        // Utilisation de la nouvelle route d'historique filtrée par l'ID de l'étudiant
        const response = await api.get(
          `/api/borrows/history?studentId=${selectedStudent.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        // Notre backend renvoie { success: true, count: X, history: [...] }
        if (response.data && Array.isArray(response.data.history)) {
          setBorrowHistory(response.data.history);
        } else {
          setBorrowHistory([]);
        }
      } catch (err) {
        console.error("Erreur historique :", err);
        setBorrowHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedStudent]);

  console.log(borrowHistory);

  const handleExportPDF = (student, history) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const siteTitle = "BUCHVAULT - SYSTEME DE GESTION DE BIBLIOTHEQUE";
    const reportTitle = `RAPPORT DES EMPRUNTS DE LIVRES`;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(siteTitle, 14, 15);

    doc.line(14, 18, 196, 18);

    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(reportTitle, 14, 28);

    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
    doc.text("INFORMATIONS ÉTUDIANT :", 14, 40);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Nom complet : ${student.first_name} ${student.last_name}`,
      14,
      46,
    );
    doc.text(`Adresse Email : ${student.email}`, 14, 52);
    doc.text(
      `Date d'extraction : ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
      14,
      64,
    );

    const tableColumns = [
      "ID Emprunt",
      "Titre du Livre",
      "Date d'Emprunt",
      "Statut / Date de Retour",
    ];

    // Adaptation aux vrais champs de ta table : borrow_id, book_title, borrowed_at, returned_at
    const tableRows = history.map((item) => {
      let statusText = "EN COURS";

      // Vérification si la date d'échéance est dépassée par rapport à l'heure actuelle
      const isOverdue =
        item.status === "emprunte" &&
        item.due_at &&
        new Date(item.due_at) < new Date();

      switch (item.status) {
        case "refuse":
          statusText = "REJETÉ";
          break;

        case "en_attente_remise":
          statusText = "DEMANDE DE PRÊT (En attente)";
          break;

        case "emprunte":
          if (isOverdue) {
            statusText = "EN RETARD";
          } else {
            statusText = "EN COURS (Non rendu)";
          }
          break;

        case "en_attente_retour":
          statusText = "RETOUR DEMANDÉ (En attente)";
          break;

        case "rendu":
          statusText = item.returned_at
            ? `RENDU LE ${new Date(item.returned_at).toLocaleDateString("fr-FR").toUpperCase()}`
            : "RESTITUÉ";
          break;

        default:
          // Sécurité si un statut inconnu ou vide remonte
          statusText = item.status ? item.status.toUpperCase() : "INCONNU";
      }

      return [
        item.borrow_id,
        item.book_title,
        item.borrowed_at
          ? new Date(item.borrowed_at).toLocaleDateString("fr-FR")
          : "-",
        statusText,
      ];
    });

    autoTable(doc, {
      startY: 72,
      head: [tableColumns],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [51, 65, 85],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 70 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          "Document officiel réservé à l'administration.",
          14,
          doc.internal.pageSize.height - 10,
        );
      },
    });

    const fileName = `Rapport_Emprunts_${student.first_name}_${student.last_name}.pdf`;
    doc.save(fileName);
  };

  const handleDeleteStudent = async (student) => {
    if (
      window.confirm(
        `Supprimer définitivement le compte de ${student.first_name} ${student.last_name} ?`,
      )
    ) {
      try {
        //  CORRECTION CRITIQUE : Changement de "axios.delete" par "api.delete"
        await api.delete(`/api/admin/users/${student.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudents(students.filter((s) => s.id !== student.id));
        setSelectedStudent(null);
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleBlockStudent = (student) => {
    alert(
      `Action Bloquer activée pour ${student.first_name}. Logique backend à venir !`,
    );
  };

  const filteredStudents = Array.isArray(students)
    ? students.filter((student) => {
        const fullName =
          `${student.first_name || ""} ${student.last_name || ""}`.toLowerCase();
        const email = (student.email || "").toLowerCase();
        const search = searchQuery.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      })
    : [];

  return (
    <div className="p-6 sm:p-8 min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Base Étudiants
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Cliquez sur un étudiant pour ouvrir son dossier d'emprunts et ses
              actions.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 shadow-sm">
            Total : {filteredStudents.length} inscrit(s)
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="mb-6 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded text-sm font-medium focus:outline-none focus:border-purple-900 shadow-sm transition"
          />
        </div>

        {/* États de l'API */}
        {isLoading && (
          <div className="p-8 text-center text-sm font-medium text-slate-400 animate-pulse">
            Chargement de la liste...
          </div>
        )}
        {!isLoading && error && (
          <div className="p-6 text-center text-sm font-semibold text-rose-700">
            Erreur serveur.
          </div>
        )}

        {/* Tableau Principal */}
        {!isLoading && !error && (
          <div className="bg-white border border-slate-200 rounded shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-400  ">
                    <th className="py-4 px-6">Nom - Prénom</th>
                    <th className="py-4 px-6">Adresse Email</th>
                    <th className="py-4 px-6 text-right">Rôle</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-10 text-slate-400 font-semibold"
                      >
                        Aucun étudiant trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="hover:bg-slate-50/80 transition cursor-pointer group"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full font-bold flex items-center justify-center text-xs uppercase group-hover:bg-slate-900 group-hover:text-white transition">
                            {(student.first_name || "U")[0]}
                            {(student.last_name || "")[0]}
                          </div>
                          <span className="text-slate-500 capitalize group-hover:text-slate-900 transition">
                            {student.first_name} {student.last_name}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 ">
                          {student.email}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                            {student.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRAND MODAL PORTRAIT / HISTORIQUE */}
        {selectedStudent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          >
            <div
              className="bg-white rounded border border-slate-200 max-w-5xl w-full p-6 shadow-2xl relative grid grid-cols-1 md:grid-cols-3 gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton Fermer Rapide */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute bg-red-700 rounded text-white top-4 right-4 text-slate-400 hover:text-slate-600 font-bold p-2 cursor-pointer transition text-sm z-10"
              >
                ✕
              </button>

              {/* PARTIE GAUCHE : INFOS & BOUTONS D'ACTIONS */}
              <div className="md:border-r md:border-slate-100 md:pr-6 flex flex-col justify-between">
                <div className="flex flex-col items-center text-center my-4">
                  <div className="w-16 h-16 bg-slate-900 text-white text-xl font-bold rounded-full flex items-center justify-center uppercase mb-3 shadow">
                    {selectedStudent.first_name[0]}
                    {selectedStudent.last_name[0]}
                  </div>
                  <h2 className="text-base font-black text-slate-900 capitalize">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 break-all">
                    {selectedStudent.email}
                  </p>
                  <span className="text-[10px] text-slate-300 font-medium mt-2">
                    ID : #{selectedStudent.id}
                  </span>
                </div>

                <div className="space-y-2 mt-8 md:mt-0">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition cursor-pointer text-center"
                  >
                    Fermer la fiche
                  </button>

                  <button
                    onClick={() => handleBlockStudent(selectedStudent)}
                    className="w-full py-2.5 px-4 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded hover:bg-amber-100 transition text-center cursor-pointer"
                  >
                    Bloquer l'accès
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(selectedStudent)}
                    className="w-full py-2.5 px-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded hover:bg-rose-100 transition text-center cursor-pointer"
                  >
                    Supprimer l'étudiant
                  </button>

                  {borrowHistory.length > 0 && (
                    <button
                      onClick={() =>
                        handleExportPDF(selectedStudent, borrowHistory)
                      }
                      className="w-full py-2.5 px-4 bg-purple-800 border border-purple-200 text-slate-100 text-xs font-bold rounded hover:bg-purple-600 transition text-center cursor-pointer"
                    >
                      Exporter en PDF
                    </button>
                  )}
                </div>
              </div>

              {/* PARTIE DROITE : HISTORIQUE DIRECT */}
              <div className="md:col-span-2 flex flex-col">
                <h3 className="uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-1.5">
                  Historique des emprunts de livres
                </h3>

                <div className="flex-1 overflow-y-auto max-h-[280px] pr-1 space-y-3">
                  {isLoadingHistory ? (
                    <p className="text-xs text-slate-400 animate-pulse py-4">
                      Chargement des emprunts...
                    </p>
                  ) : borrowHistory.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-100 rounded">
                      <p className="text-xs font-medium text-slate-900 mt-1">
                        Aucun livre emprunté pour le moment.
                      </p>
                    </div>
                  ) : (
                    borrowHistory.map((item) => {
                      // 1. Logique d'affichage et de style calquée sur les vrais statuts de ta BDD
                      let statusLabel = "";
                      let statusStyle = "";
                      const isOverdue =
                        item.status === "emprunte" &&
                        item.due_at &&
                        new Date(item.due_at) < new Date();
                      switch (item.status) {
                        case "refuse":
                          statusLabel = "Refusé";
                          statusStyle =
                            "bg-rose-50 text-rose-600 border-rose-200";
                          break;
                        case "en_attente_remise":
                          statusLabel = "Demande de prêt";
                          statusStyle =
                            "bg-blue-50 text-blue-600 border-blue-200";
                          break;
                        case "emprunte":
                          if (isOverdue) {
                            statusLabel = "En retard";
                            statusStyle =
                              "bg-rose-50 text-rose-700 border-rose-300 font-bold border-l-4 border-l-rose-500 rounded-r rounded-l-none";
                          } else {
                            statusLabel = "En cours";
                            statusStyle =
                              "bg-amber-50 text-amber-700 border-amber-200";
                          }
                          break;
                        case "en_attente_retour":
                          statusLabel = "Retour demandé";
                          statusStyle =
                            "bg-violet-50 text-violet-600 border-violet-200";
                          break;
                        case "rendu":
                          statusLabel = item.returned_at
                            ? `Rendu le ${new Date(item.returned_at).toLocaleDateString("fr-FR")}`
                            : "Restitué";
                          statusStyle =
                            "bg-emerald-50 text-emerald-700 border-emerald-200";
                          break;
                        default:
                          statusLabel = item.status || "Inconnu";
                          statusStyle =
                            "bg-slate-100 text-slate-600 border-slate-200";
                      }

                      return (
                        <div
                          key={item.borrow_id}
                          className="p-3 bg-slate-50 border border-slate-100 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-slate-200 transition"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.book_title}
                            </h4>
                            <p className="text-[10px] text-slate-900 font-medium mt-0.5">
                              Emprunté le :{" "}
                              {item.borrowed_at
                                ? new Date(item.borrowed_at).toLocaleDateString(
                                    "fr-FR",
                                  )
                                : "-"}
                            </p>
                          </div>

                          {/* 2. Affichage propre du badge avec la couleur adaptée au statut réel */}
                          <span
                            className={`self-start sm:self-center px-2 py-0.5 rounded text-[10px] border ${statusStyle}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
