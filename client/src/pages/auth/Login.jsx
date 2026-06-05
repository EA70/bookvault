import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import libraryBg from "../../assets/login.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Initialisation du lecteur d'URL
  const { login } = useContext(AuthContext);

  // Intercepter le retour de l'étudiant depuis sa boîte mail (?verified=true)
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess(
        "Votre adresse email a été validée avec succès ! Vous pouvez maintenant vous connecter.",
      );
    }
  }, [searchParams]);
  //-- fin de l'interception du paramètre d'activation par mail

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); 

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs si possible.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post(`/login`, { email, password });
      //console.log("Données reçues du serveur :", response.data);

      // Extraction du token (le serveur ne renvoie plus d'objet response.data.user)
      const { token } = response.data;

      if (token) {
        // Enregistrement initial du jeton anonyme dans le LocalStorage ou ton Context global
        login({
          token,
          role: "pending", // Le rôle exact est masqué par sécurité -- le backend le révélera dans la route /me une fois le token vérifié.
          username: "Utilisateur",
        });

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          navigate("/putulu-admin");
        } catch (adminErr) {
          navigate("/book");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("VRAIE ERREUR DE CONNEXION :", err.response?.data || err);

      // Gestion des codes d'erreurs renvoyés par le backend
      const serverMessage = err.response?.data?.message;
      if (err.response?.status === 401) {
        setError("Identifiants invalides. Veuillez réessayer.");
      } else if (err.response?.status === 403) {
        setError( serverMessage || "Votre compte n'est pas actif ou a été suspendu par l'administration.",);
      } else if (err.response?.status === 404) {
        setError("Utilisateur non trouvé.");
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* CÔTÉ GAUCHE : IMMERSIF (Visible uniquement sur Desktop >= lg) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 relative">
        {/* Petit rappel de logo sur Mobile uniquement */}
        <div className="min-h-screen flex items-center justify-center py-10 sm:px-6 lg:px-8">
          {/* Card Container */}
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-2 sm:mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-700 tracking-tight">
                Connexion
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-2">
                Connectez-vous pour accéder à votre compte.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded mt-10 ">
              {/* Bandeau de Succès (Si activation par mail réussie) */}
              {success && (
                <div className="mb-6 p-3 rounded bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-top-2">
                  <p className="  text-sm text-emerald-700 flex items-start gap-3">
                    <span>{success}</span>
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2">
                  <p className="  text-sm text-red-700 flex items-start gap-3">
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Adresse Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="Entrez votre email"
                    className="  w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="font-satoshi text-sm font-semibold text-gray-900"
                    >
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="  text-xs text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {showPassword ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Entrez votre mot de passe"
                    className="  w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div>
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-gray-200 text-purple-600 focus:ring-purple-800 cursor-pointer"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-600 cursor-pointer"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-purple-600 hover:text-purple-600 transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="font-satoshi w-full py-2 px-4 rounded bg-purple-800  text-white hover:bg-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5 animate-spin"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Connexion en cours...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="  text-xs text-gray-500">OU</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Alternative Actions */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="  w-full py-2 px-4 rounded  text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Se connecter avec Google
                </button>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <p className="  text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  to="/registration"
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
              <p className="  text-xs text-gray-500">
                En vous connectant, vous acceptez nos{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  Conditions d'utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  Politique de confidentialité
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE RESPONSIVE (Prend tout l'écran sur Mobile/Tablette) */}
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
            Connectez-vous et accédez à des milliers d'ouvrages en un clic.
          </h2>
          <p className="text-slate-300 text-sm font-normal leading-relaxed max-w-sm">
            Avec votre compte, gérez vos emprunts de manière fluide, et restez notifié de vos retours sans stress via notre tableau de bord intelligent.
          </p>
        </div>

        <div className="absolute bottom-12 text-xs text-slate-500 font-medium tracking-wide z-10">
          &copy; 2026 BuchVault. Propulsé par l'excellence académique.
        </div>
      </div>
    </div>
  );
}
