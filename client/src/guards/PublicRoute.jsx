import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { useContext } from "react";

/**
 * Route guard for public pages (Login, Register)
 * Redirects to dashboard/catalog if user is already authenticated
 */
export default function PublicRoute() {
  const { user, loading } = useContext(AuthContext);
 
  // Attente du chargement asynchrone du profil
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === "admin" ? "/putulu-admin" : "/book"} replace />;
  }

  return <Outlet />;
}