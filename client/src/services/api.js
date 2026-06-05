/**
 * Ce ptit fichier m enpeche d importer a tout moment axios dans toutes
 * les autres composants 
 * 
 * Interessant !!  
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => { 
    return response;
  },
  (error) => { 
    const url = error.config?.url || "";
    const isVerifyRoute = url.includes("/api/verify-route");
 
    const isAuthRoute =
      url.includes("/login") ||
      url.includes("/registration") ||
      url.includes("/verify-email");

    // IMPORTANT:
    // - 401 = non authentifié / token manquant / session expirée -> on déconnecte
    // - 403 = interdit (ex: route étudiant appelée par un admin) -> ne PAS déconnecter automatiquement
    if (!isVerifyRoute && !isAuthRoute && error.response && error.response.status === 401) {
      console.warn("Session expirée ou invalide (401). Nettoyage du stockage et redirection...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;