/** * Composant qui gère le Panier / Checkout
 * Synchronisé avec le système d'intercepteurs automatiques d'Axios
 */
import { useContext, useState } from "react";
import api from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { BookCopy, Trash } from "lucide-react";

export default function CartSummary({ onSuccess }) {
  // On extrait userQuota et fetchUserQuota de notre CartContext mis à jour
  const { cart, userQuota, fetchUserQuota, clearCart, removeFromCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidateEmprunt = async () => {
    if (!cart.length) return;

    // BARRIÈRE FRONT-END 1 : Blocage des doublons (Livre déjà chez l'étudiant ou en attente admin)
    const activeBookIdsInDB = userQuota?.activeBookIds ?? [];
    const duplicateBook = cart.find((item) => activeBookIdsInDB.includes(item.id));

    if (duplicateBook) {
      return alert(
        `Emprunt refusé : Vous demandez "${duplicateBook.title}", mais ce livre est déjà en votre possession ou en attente de validation par l'administration.`
      );
    }

    // BARRIÈRE FRONT-END 2 : Blocage du dépassement de quota cumulé (Prêts BDD + Panier actuel)
    const totalBorrowedInDB = userQuota?.totalBorrowed ?? 0;
    const totalFutur = totalBorrowedInDB + cart.length;

    if (totalFutur > 3) {
      return alert(
        `Limite atteinte : Vous avez déjà ${totalBorrowedInDB} prêt(s)/demande(s) en cours. ` +
        `Avec les ${cart.length} livre(s) de votre panier, vous dépassez le maximum de 3 livres autorisés. ` +
        `Veuillez réduire votre panier ou retourner vos livres actuels.`
      );
    }

    // ENVOI AU BACKEND SI TOUTES LES RÈGLES SONT RESPECTÉES
    setIsLoading(true);
    try {
      const bookIds = cart.map(({ id }) => id);
      const { data } = await api.post("/api/loans/validate-cart", { bookIds });

      // Affiche le nouveau message d'attente d'administration
      alert(data.message);
      clearCart();
      await fetchUserQuota();

      // On émet l'événement pour fermer le panier ou notifier le catalogue s'il doit réagir
      window.dispatchEvent(new CustomEvent("panier_traite"));
      onSuccess?.();

    } catch (err) {
      console.error("Erreur réservation :", err);
      alert(err.response?.data?.message ?? "Erreur lors de la réservation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {cart.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          Votre panier est vide pour le moment...
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-100 p-5 mb-6">
            {cart.map((book) => (
              <div key={book.id} className="py-3.5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{book.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Par {book.author}</p>
                </div>
                <button
                  onClick={() => removeFromCart(book.id)}
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium bg-rose-50 p-2 rounded transition-all duration-200"
                  title="Retirer du panier"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 sticky bottom-0 bg-white">
            <button
              onClick={handleValidateEmprunt}
              disabled={isLoading}
              className={`w-full flex justify-center text-center items-center gap-2 px-4 py-2.5 rounded text-white text-xs font-semibold transition-all duration-200 shadow-sm shadow-violet-200 cursor-pointer ${
                isLoading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-800 hover:bg-purple-600 active:scale-95"
              }`}
            >
              <BookCopy className="w-4 h-4" />
              {isLoading ? "Validation en cours..." : "Confirmer l'emprunt"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}