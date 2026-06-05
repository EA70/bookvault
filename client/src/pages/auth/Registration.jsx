import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

import libraryBg from "../../assets/bg.jpg";

export default function Registration() {
  const navigate = useNavigate();

  // 1. États du formulaire (Clés calées sur ton req.body backend)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Gestionnaire de saisie dynamique
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // On efface l'erreur dès que l'utilisateur recorrige sa saisie
    if (error) setError("");
  };

  // 3. Logique de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Petite sécurité Front rapide avant d'appeler l'API
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/register",
        formData,
      );

      // Vider le formulaire
      setFormData({ first_name: "", last_name: "", email: "", password: "" });

      // Redirection vers le login après 2 petites secondes pour laisser le temps de lire le succès
      setTimeout(() => {
        navigate("/register-success", {
          state: { fromRegister: true },
          replace: true,
        });
      }, 2000);
    } catch (err) {
      console.error("Erreur Inscription :", err);
      // On intercepte le message précis envoyé par ton backend (ex: "Cet Email est deja existant.")
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la création du compte.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex   overflow-hidden">
      {/* CÔTÉ GAUCHE : IMMERSIF (Visible uniquement sur Desktop >= lg) */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${libraryBg})` }}
        />

        {/* Overlay — plus sombre que la hero pour que le panneau login soit bien lisible */}
        <div className="absolute inset-0 bg-slate-900/80" />

        {/* Contenu */}
        <div className="relative z-10 max-w-md my-auto flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
            Accédez à des milliers d'ouvrages en un clic.
          </h2>
          <p className="text-slate-300 text-sm font-normal leading-relaxed max-w-sm">
            Rejoignez notre communauté étudiante, gérez vos emprunts de manière
            fluide, et restez notifié de vos retours sans stress via notre
            tableau de bord intelligent.
          </p>
        </div>

        <div className="absolute bottom-12 text-xs text-slate-500 font-medium tracking-wide z-10">
          &copy; 2026 BuchVault. Propulsé par l'excellence académique.
        </div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE RESPONSIVE (Prend tout l'écran sur Mobile/Tablette) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white relative">
        {/* Petit rappel de logo sur Mobile uniquement */}

        <div className="max-w-md w-full mx-auto">
          {/* Header Titre */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Créer un compte
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-2">
              Prêt à explorer la bibliothèque ? Remplissez vos informations.
            </p>
          </div>

          {/* GESTION DES NOTIFICATIONS (Erreur / Succès) */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center gap-3 text-rose-700 text-sm font-bold animate-headShake">
              <p>{error}</p>
            </div>
          )}

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Grille Prénom / Nom (Responsive : Côte à côte sur grand écran, empilé sur mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jean"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Dupont"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Champ Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Adresse Email Académique
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@univ.fr"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-200  text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                required
              />
            </div>

            {/* Bouton de Validation */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 mt-2 bg-purple-800 text-white font-bold text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-200 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  {/* Petit spinner de chargement élégant */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Création de votre espace...</span>
                </>
              ) : (
                <span>Créer mon compte étudiant</span>
              )}
            </button>
          </form>

          {/* Lien vers la page Connexion */}
          <p className="text-center text-sm font-semibold text-slate-500 mt-8">
            Vous possédez déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 underline font-bold transition"
            >
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
