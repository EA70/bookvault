import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");  

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/reset-password", { token, password });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");  
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6 font-satoshi">Nouveau mot de passe</h2>

        {message && <div className="p-4 mb-4 text-sm text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">{message}</div>}
        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
            <input
              type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50">
            {isLoading ? "Modification..." : "Enregistrer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}