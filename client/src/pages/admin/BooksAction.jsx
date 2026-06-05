import { useState, useEffect, useContext, useCallback } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Plus } from "lucide-react";

export default function BooksAction() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("title_asc");
  const { user } = useContext(AuthContext);

  const [initialData, setInitialData] = useState({});

  // États pour le Modal (Ajout / Édition)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    published_year: "",
    total_copies: "",
    copies_available: "",
    category: "",
    category_id: "",
    cover_image: "",
  });
  const [toast, setToast] = useState({ show: false, message: "" });

  // --- CHARGEMENT DES DONNÉES ---

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      // 💡 Note : J'ai gardé tes routes exactes /books et /api/categories
      const [booksRes, catsRes] = await Promise.all([
        api.get("/books"),
        api.get("/api/categories").catch(() => ({ data: [] })) 
      ]);
      
      setBooks(booksRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error("Erreur chargement catalogue", err);
    } finally {
      setLoading(false);
    }
    }, []);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);


  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setInitialData(book);

      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        published_year: book.published_year,
        category_id: book.category_id,
        total_copies: book.total_copies,
        copies_available: book.copies_available,
        category: book.category || "",
        cover_image: book.cover_image || "",
      });
    } else {
      setEditingBook(null);
      setInitialData({});

      setFormData({
        title: "",
        author: "",
        isbn: "",
        description: "",
        published_year: "",
        total_copies: "",
        copies_available: "",
        category: "",
        cover_image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        showToast("Livre modifié avec succès !");
      } else {
        await api.post("/ajout-livres", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showToast("Nouveau livre ajouté aux rayons !");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Voulez-vous vraiment supprimer ce livre du catalogue ?")
    ) {
      try {
        await api.delete(`/books/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showToast("Livre supprimé du système.");
        fetchData();
      } catch (err) {
        showToast(
          "Impossible de supprimer ce livre (peut-être en cours d'emprunt).",
        );
      }
    }
  };

  const getInputClass = (field) => {
    // MODE AJOUT → style normal uniquement
    if (!editingBook) {
      return `
        w-full bg-slate-50 border border-slate-200 rounded px-3 py-2
        text-sm text-slate-800 focus:outline-none
        focus:border-violet-500 focus:bg-white transition
      `;
    }

    // MODE EDITION
    const originalValue = initialData?.[field];
    const currentValue = formData?.[field];

    const isModified =
      String(currentValue ?? "") !== String(originalValue ?? "");

    return `
      w-full rounded px-3 py-2 text-sm transition-all duration-200 focus:outline-none
      ${
        isModified
          ? "bg-amber-50 border border-amber-400 text-amber-900 focus:border-amber-500 ring-2 ring-amber-100"
          : "bg-slate-50 border border-slate-200 text-slate-800 focus:border-violet-500 focus:bg-white"
      }
    `;
  };
  // --- FILTRES ET RECHERCHE MULTI-CRITÈRES SYNCHRONE ---
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

  return (
    <div className="p-6 min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto">


      {/* HEADER ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Gestion de la Bibliothèque
          </h1>
          <p className="text-sm text-slate-500">
            Gérez le catalogue, ajustez les stocks et filtrez par genre et
            catégorie.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-purple-800 hover:bg-purple-600 active:scale-95 text-white text-xs font-semibold transition-all duration-200 shadow-sm shadow-violet-200 cursor-pointer"
        >
          <Plus />
          Ajouter un livre
        </button>
      </div>

      {/* RECHERCHE ET FILTRES MULTIPLES */}
      <div className="bg-white border border-slate-200 rounded p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Recherche */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Recherche
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Titre, auteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Catégorie
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6z"
                />
              </svg>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-sm pl-9 pr-8 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Tri */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Trier par
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-sm pl-9 pr-8 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="title_asc">Titre : A → Z</option>
                <option value="title_desc">Titre : Z → A</option>
                <option value="author">Auteur</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CORPS : LISTE OU VIDE */}
      {loading ? (
        <p className="text-center py-12 text-slate-400 text-sm animate-pulse font-medium">
          Chargement des étagères...
        </p>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl shadow-sm">
          <p className="text-slate-400 text-sm font-medium">
            Aucun livre ne correspond à vos critères de recherche.
          </p>
        </div>
      ) : (
        /* GRILLE DE LIVRES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-slate-200 rounded overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Couverture */}
              <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                {book.cover_image ? (
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
                  style={{ display: book.cover_image ? "none" : "flex" }}
                >
                  <svg
                    className="w-8 h-8 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>

                {/* Badge stock flottant */}
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-1 rounded border backdrop-blur-sm ${
                    book.copies_available > 0
                      ? "bg-emerald-50/90 text-emerald-700 border-emerald-200"
                      : "bg-rose-50/90 text-rose-600 border-rose-200"
                  }`}
                >
                  {book.copies_available > 0
                    ? `${book.copies_available} / ${book.total_copies} dispo`
                    : "Épuisé"}
                </span>
              </div>

              {/* Contenu */}
              <div className="flex flex-col flex-1 p-4">
                {/* Catégorie */}
                {book.category_name && (
                  <span className="self-start text-[10px] font-semibold uppercase text-violet-500 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded mb-2">
                    {book.category_name}
                  </span>
                )}

                {/* Titre + auteur */}
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 mb-3">
                  Par {book.author}
                </p>

                {/* Description */}
                {book.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {book.description}
                  </p>
                )}

                {/* Méta infos */}
                <div className="space-y-1 mb-4">
                  {book.isbn && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">ISBN</span>
                      <span className="text-slate-600 font-mono">
                        {book.isbn}
                      </span>
                    </div>
                  )}
                  {book.published_year && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        Publication
                      </span>
                      <span className="text-slate-600">
                        {book.published_year}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      Stock total
                    </span>
                    <span className="text-slate-600">
                      {book.total_copies} exemplaire
                      {book.total_copies > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenModal(book)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                      />
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AVEC LES CHAMPS COMPLETS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden">
            {/* Header — bg-slate-900 */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {editingBook ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {editingBook
                      ? "Modifier la fiche du livre"
                      : "Ajouter un nouveau livre"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {editingBook
                      ? "Modifiez les informations ci-dessous"
                      : "Remplissez les informations du nouveau livre"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Corps du formulaire */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {/* Titre */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Titre du livre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={getInputClass("title")}
                  />
                </div>

                {/* Auteur */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Auteur
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className={getInputClass("author")}
                  />
                </div>

                {/* Catégorie */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Catégorie
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      className={`${getInputClass("category_id")} appearance-none pr-8 cursor-pointer`}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Description — pleine largeur */}
                <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2 lg:col-span-3">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`${getInputClass("description")} resize-none`}
                  />
                </div>

                {/* Année de publication */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Année de publication
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.published_year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        published_year: e.target.value,
                      })
                    }
                    className={getInputClass("published_year")}
                  />
                </div>

                {/* Total exemplaires */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Nombre total d'exemplaires
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.total_copies}
                    onChange={(e) =>
                      setFormData({ ...formData, total_copies: e.target.value })
                    }
                    className={getInputClass("total_copies")}
                  />
                </div>

                {/* Champs uniquement en mode édition */}
                {editingBook && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        ISBN
                      </label>
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) =>
                          setFormData({ ...formData, isbn: e.target.value })
                        }
                        className={getInputClass("isbn")}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        URL couverture
                      </label>
                      <input
                        type="text"
                        value={formData.cover_image}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cover_image: e.target.value,
                          })
                        }
                        className={getInputClass("cover_image")}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        Exemplaires disponibles
                      </label>
                      <input
                        type="number"
                        value={formData.copies_available}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            copies_available: e.target.value,
                          })
                        }
                        className={getInputClass("copies_available")}
                      />
                    </div>
                  </>
                )}

                {/* Footer actions — pleine largeur */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-semibold transition-all duration-200 shadow-sm shadow-violet-200 cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {editingBook
                      ? "Enregistrer les modifications"
                      : "Ajouter le livre"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded shadow-xl transition-all duration-300 transform ${
          toast.show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="text-xs font-bold text-slate-700">{toast.message}</p>
      </div>

      </div>
    </div>
  );
}
