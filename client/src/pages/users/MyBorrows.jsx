import { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import { CartContext } from "../../context/CartContext";



export default function StudentLoans() {
  const [loans, setLoans] = useState([]);
  const [selectedReturnIds, setSelectedReturnIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchUserQuota } = useContext(CartContext);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/my-loans");

      // CORRECTION CRITIQUE : On ne garde que les livres qui ne sont PAS encore marqués comme 'rendu'
      // De cette façon, dès que l'admin accepte, le livre disparaît instantanément du compte étudiant.
      const activeLoans = data.filter((loan) => loan.status !== "rendu");
      setLoans(activeLoans);
    } catch (err) {
      console.error("Erreur chargement emprunts :", err);
      alert("Impossible de charger vos emprunts en cours.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  console.log(loans);

  const handleToggleSelect = (borrowId) => {
    setSelectedReturnIds((prev) =>
      prev.includes(borrowId)
        ? prev.filter((id) => id !== borrowId)
        : [...prev, borrowId],
    );
  };

  // Valider le panier de retour
  const handleRequestReturn = async () => {
    if (!selectedReturnIds.length) return;

    setIsSubmitting(true);
    try {
      // Appel API synchronisé pour passer au statut 'en_attente_retour'
      const { data } = await api.post("/api/loans/request-return", {
        borrowIds: selectedReturnIds,
      });

      alert(
        data.message ??
          "Demande de retour enregistrée ! Rapportez les livres à la bibliothèque.",
      );

      // Réinitialiser le panier de sélection local
      setSelectedReturnIds([]);

      // Rafraîchir les données et quotas
      await fetchLoans();
      if (fetchUserQuota) await fetchUserQuota();
    } catch (err) {
      console.error("Erreur demande retour :", err);
      alert(err.response?.data?.message ?? "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Chargement de vos livres...
        </p>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(",", " à");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-manrope">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LISTE DES EMPRUNTS */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Mes Livres Empruntés
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Cochez les livres que vous souhaitez restituer à la bibliothèque.
          </p>

          {loans.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded p-8 text-center text-slate-400">
              Aucun livre emprunté ou en attente de retour pour le moment.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-200 text-xs  text-slate-100 uppercase">
                    <th className="p-4 w-12 text-center">Choisir</th>
                    <th className="p-4">Livre</th>
                    <th className="p-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loans.map((loan) => {
                    const isEnAttenteConfirmation =
                      loan.status === "en_attente_remise";
                    const isEnAttenteRetour =
                      loan.status === "en_attente_retour";
                    const isEmprunte = loan.status === "emprunte";

                    // Bloquer la case à cocher si une action de l'admin est requise
                    const isCheckboxDisabled =
                      isEnAttenteConfirmation || isEnAttenteRetour;
                    const isChecked = selectedReturnIds.includes(
                      loan.borrow_id,
                    );

                    // Configuration par défaut du badge
                    let badgeText = "Emprunté";
                    let badgeStyles =
                      "bg-amber-50 text-amber-700 ring-amber-600/20";

                    if (isEnAttenteConfirmation) {
                      badgeText = "En attente de confirmation";
                      badgeStyles = "bg-blue-50 text-blue-700 ring-blue-600/20";
                    } else if (isEnAttenteRetour) {
                      badgeText = "En attente de validation retour";
                      badgeStyles =
                        "bg-purple-50 text-purple-700 ring-purple-600/20";
                    }

                    return (
                      <tr
                        key={loan.borrow_id}
                        className={`transition ${isChecked ? "bg-purple-50/30" : "hover:bg-slate-50/50"}`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            disabled={isCheckboxDisabled}
                            checked={isChecked}
                            onChange={() => handleToggleSelect(loan.borrow_id)}
                            className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-800">
                            {loan.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            Par {loan.author}
                          </p>
                          {loan.due_at && (
                            <span className="text-xs text-red-400 mt-0.5">
                              Date de retour Oblig. :{" "}
                              <span className="text-xs text-red-400 mt-0.5">
                                {formatDateTime(loan.due_at)}
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeStyles}`}
                          >
                            {badgeText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PANIER DE RETOUR */}
        <div className="w-full">
          <div className="bg-white p-6 rounded border border-slate-200 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Panier de retour
            </h2>

            <p className="text-xs text-slate-400 mb-4">
              Confirmez les livres que vous allez déposer physiquement.
            </p>

            {selectedReturnIds.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-xl">
                Cochez un ou plusieurs livres à gauche pour commencer la remise.
              </p>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 mb-6">
                  {loans
                    .filter((loan) =>
                      selectedReturnIds.includes(loan.borrow_id),
                    )
                    .map((loan) => (
                      <div
                        key={loan.borrow_id}
                        className="py-3 flex justify-between items-center text-sm"
                      >
                        <div className="pr-2">
                          <p className="font-medium text-slate-800 line-clamp-1">
                            {loan.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            Par {loan.author}
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleSelect(loan.borrow_id)}
                          className="text-xs text-rose-500 hover:underline shrink-0 font-medium"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={handleRequestReturn}
                  disabled={isSubmitting}
                  className="w-full p-2 bg-purple-800 text-white rounded hover:bg-purple-600 transition disabled:opacity-50 cursor-pointer text-sm font-semibold shadow-xs"
                >
                  {isSubmitting
                    ? "Traitement..."
                    : `Remettre les ${selectedReturnIds.length} livre(s)`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
