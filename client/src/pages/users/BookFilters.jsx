export default function BookFilters({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="rounded p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Titre, auteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm px-3 py-2 rounded border border-slate-200"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full text-sm px-3 py-2 rounded border border-slate-200"
        >
          <option value="">Toutes les catégories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full text-sm px-3 py-2 rounded border border-slate-200"
        >
          <option value="title_asc">Titre A → Z</option>
          <option value="title_desc">Titre Z → A</option>
          <option value="author">Auteur</option>
        </select>
      </div>
    </div>
  );
}
