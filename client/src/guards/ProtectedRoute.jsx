import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  // Attente du chargement asynchrone du profil
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si l'objet user n'a pas pu être chargé (token invalide ou manquant) -> Redirection
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté, on laisse l'accès aux routes enfants (comme /book)
  return <Outlet />;
}