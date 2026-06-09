import { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/forgot-password", { email });
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
    <div className="min-h-screen flex items-center justify-center px-4 font-manrope">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2 font-satoshi">Mot de passe oublié</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Saisissez votre adresse email pour recevoir un lien de réinitialisation.</p>

        {message && <div className="p-4 mb-4 text-sm text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">{message}</div>}
        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
              placeholder="etudiant@ecole.fr"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50">
            {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}