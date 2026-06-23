import { useState, useEffect, useContext, useCallback } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import CartSummary from "./CartSummary";
import BookFilters from "./BookFilters";
import BookHeader from "./BookHeader";
import BookGrid from "./BookGrid";
import { ShoppingBag, X } from "lucide-react";

export default function Book() {
  const { user } = useContext(AuthContext);
  const { cart, addToCart } = useContext(CartContext);

  // États pour les données
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres, tris et pagination
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("title_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  // États pour l'envoi du panier
  const [isSubmitting, setIsSubmitting] = useState(false);

  //slider
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userQuota, setUserQuota] = useState({
    totalBorrowed: 0,
    activeBookIds: [],
  });

  // Fetch des données (catalogue + quota)
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [booksRes, catsRes, quotaRes] = await Promise.all([
        api.get("/books"),
        api.get("/api/categories").catch(() => ({ data: [] })),
        api
          .get("/users/quota")
          .catch(() => ({ data: { totalBorrowed: 0, activeBookIds: [] } })),
      ]);

      setBooks(booksRes.data);
      setCategories(catsRes.data);
      setUserQuota(quotaRes.data);

    } catch (err) {
      console.error("Erreur chargement catalogue", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(books);

  // Auto-refresh: permet de voir les changements (validation admin, stock, quota) sans recharger la page.
  useEffect(() => {
    if (!user) return;
    const refresh = () => fetchData();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", refresh);
    const intervalId = window.setInterval(refresh, 15000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", refresh);
      window.clearInterval(intervalId);
    };
  }, [user, fetchData]);

  // 2. Logique de Filtrage et de Tri (Côté client pour la fluidité)
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "" ||
        String(book.category_id) === String(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      if (sortBy === "title_desc") return b.title.localeCompare(a.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      return 0;
    });

  // 3. Logique de Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Reset la page si on filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-purple-600">
        Chargement du catalogue...
      </div>
    );

  return (
    <div className="min-h-screen p-4 sm:p-8 font-manrope">
      <div className="max-w-5xl mx-auto">
        <BookHeader
          cartCount={cart.length}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* FILTRES & TRIS*/}
        <BookFilters
          search={search}
          setSearch={setSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* LISTE DES LIVRES (GRID CARDS) */}
        <BookGrid
          books={currentItems}
          cart={cart}
          userQuota={userQuota}
          addToCart={addToCart}
        />

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1.5 rounded border border-slate-200 bg-white text-sm font-medium disabled:opacity-50"
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-9 h-9 text-sm font-semibold rounded-lg transition ${currentPage === index + 1
                    ? "bg-purple-800 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-purple-200"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1.5 rounded border border-slate-200 bg-white text-sm font-medium disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}

        {/* VOLET COULISSANT DU PANIER (DRAWER) */}
        <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isCartOpen ? "visible" : "invisible"}`} >
          <div
            className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsCartOpen(false)}
          />
          <div
            className={`absolute inset-y-0 right-0 flex transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="w-screen max-w-md bg-white flex flex-col h-full shadow-2xl">
              {/* Header */}
              <div className="h-16 px-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="text-purple-80 " />
                  <div>
                    <h2 className="text-lg mt-5 font-bold text-purple-800 leading-tight font-bold">
                      Sélection d'emprunts
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {cart.length} livre{cart.length > 1 ? "s" : ""}{" "}
                      sélectionné
                      {cart.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded flex items-center justify-center text-white bg-red-400 hover:bg-red-300 transition-colors"
                  aria-label="Fermer le panier"
                >
                  <X />
                </button>
              </div>

              {/* Corps */}
              <div className="flex-1 overflow-y-auto p-5">
                <CartSummary
                  refreshBooks={fetchData}
                  onSuccess={() => setIsCartOpen(false)}
                />
              </div>

            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
