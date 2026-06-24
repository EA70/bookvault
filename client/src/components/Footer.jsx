import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Ajuste le chemin selon ton architecture
import { Link } from "react-router-dom";

export default function Footer() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }
  if (user && user.role === "admin") {
    return null;  
  }
  return (
    <div>
      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              {/* Harmonisation du nom de la marque */}
              <h3 className="font-satoshi text-white font-bold text-lg mb-4">
                BuchVault
              </h3>
              <p className="font-manrope text-sm leading-relaxed">
                La plateforme définitive pour les amoureux de livres.
              </p>
            </div>

            <div>
              <h4 className="font-geist text-white font-semibold mb-4">
                Liens utiles
              </h4>
              <ul className="space-y-2 text-sm font-inter">
                <li>
                  <Link to="/apropos" className="hover:text-white transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-geist text-white font-semibold mb-4">
                Ressources
              </h4>
              <ul className="space-y-2 text-sm font-inter">
                <li>
                  <Link to="/documentation" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-geist text-white font-semibold mb-4">
                Légal
              </h4>
              <ul className="space-y-2 text-sm font-inter">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Conditions
                  </a>
                </li>
              </ul>
            </div>
            
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="font-manrope text-center text-sm">
              © 2026 BuchVault. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}