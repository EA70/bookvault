import { useContext } from "react"; 
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

 
export default function AdminRoute() {
  const { user, loading } = useContext(AuthContext);  

 
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}