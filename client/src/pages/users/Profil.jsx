import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, BookCopy, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Profil() {
  const navigate = useNavigate();
  const { logout, user: authUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.user) setProfileData(response.data.user);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Erreur de communication avec le service d'authentification.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    try {
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        <p className="mt-3 text-xs font-medium text-slate-400">
          Récupération des données sécurisées...
        </p>
      </div>
    );
  }

  const currentFields = profileData || authUser;
  const initials =
    currentFields?.first_name && currentFields?.last_name
      ? `${currentFields.first_name[0]}${currentFields.last_name[0]}`.toUpperCase()
      : "?";

  const isAdmin = currentFields?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-5 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">


        {/* Erreur */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-lg bg-rose-50 border border-rose-200">
            <svg className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Colonne gauche — Carte identité */}
          <div className="bg-white  rounded overflow-hidden  border border-slate-100 h-fit">

            {/* Banner */}
            <div className="h-20 bg-slate-50 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #7c3aed 0%, transparent 60%), radial-gradient(circle at 80% 20%, #db2777 0%, transparent 50%)" }}
              />
            </div>

            {/* Avatar */}
            <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
              <div className="w-20 z-1 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-lg font-black border-4 border-white shadow-md mb-3">
                {initials}
              </div>

              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {currentFields?.first_name} {currentFields?.last_name}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-full">
                {currentFields?.email}
              </p>

              {/* Actions rapides */}
              <div className="mt-5 w-full space-y-2">
                <button
                  onClick={() => navigate("/my-loans")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                >
                  <BookCopy className="h-3.5 w-3.5 text-slate-500" />
                  Mes emprunts
                </button>
                <button
                  onClick={() => navigate("/my-loans")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                >
                  <BookCopy className="h-3.5 w-3.5 text-slate-500" />
                  Historique
                </button>

                {isAdmin && (
                  <button
                    onClick={() => navigate("/putulu-admin")}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-all duration-200"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Panel d'administration
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold hover:bg-rose-100 hover:border-rose-200 transition-all duration-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Terminer la session
                </button>
              </div>
            </div>
          </div>

          {/* Colonne droite — Informations compte */}
          <div className="lg:col-span-2 bg-white  rounded border border-slate-100 overflow-hidden">

            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4 " />
              </div>
              <div>
                <h3 className="text-sm font-bold ">Informations du compte</h3>
                <p className="text-[11px] text-slate-400">
                  Données d'identification
                </p>
              </div>
            </div>

            {/* Champs */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Prénom */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      readOnly
                      value={currentFields?.first_name || ""}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none cursor-default"
                    />
                  </div>
                </div>

                {/* Nom */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Nom de famille
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      readOnly
                      value={currentFields?.last_name || ""}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none cursor-default"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Adresse de messagerie
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                    <input
                      type="email"
                      readOnly
                      value={currentFields?.email || ""}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-600 focus:outline-none cursor-default"
                    />
                  </div>
                </div>

                {/* Rôle */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Rôle & permissions
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200">
                    <Shield className={`h-4 w-4 shrink-0 ${isAdmin ? "text-amber-500" : "text-violet-400"}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {isAdmin ? "Administrateur" : "Étudiant"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {isAdmin
                          ? "Accès complet au panel d'administration"
                          : "Accès au catalogue et aux emprunts"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Note sécurité */}
              <div className="mt-5 flex items-start gap-2.5 p-3.5 rounded bg-slate-50 border border-slate-100">
                <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ces informations sont en lecture seule et vérifiées par votre jeton de session sécurisé. Pour toute modification, contactez un administrateur.
                </p>
              </div>
            </div>
          </div>

        </div>



       {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour
        </button>
        
      </div>

      

    </div>
  );
}