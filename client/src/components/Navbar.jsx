import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  BookCopy,
  Book,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  Info,
  LayoutDashboard,
  Phone,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { logout, user } = useContext(AuthContext);
  const userMenuRef = useRef(null);

  // Détermine si l'utilisateur est connecté (présence de l'objet user)
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le menu user si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ferme le menu mobile à chaque changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    try {
      logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? "text-purple-600 bg-purple-50"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  const mobileNavLinkClass = (path) =>
    `flex items-center px-3 py-2.5 rounded text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? "text-purple-600 bg-purple-50"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  // Cache la navbar pour l'interface admin complète si nécessaire
  if (location.pathname.startsWith("/putulu-admin")) return null;

  const displayName = user ? `${user.first_name} ${user.last_name}` : "";
  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : "?";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-50 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-slate-100"
      }`}
    >
      {/* Mobile Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className="text-xl font-black bg-gradient-to-r from-purple-800 to-pink-500 bg-clip-text text-transparent tracking-tight">
              BuchVault
            </span>
          </Link>

          {/* Desktop — liens centraux */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass("/")}>
              <Home className="h-3.5 w-3.5 inline mr-1" /> Home
            </Link>
            {isAuthenticated && (
              <Link to="/book" className={navLinkClass("/book")}>
                <Book className="h-3.5 w-3.5 inline mr-1" /> Books
              </Link>
            )}
            <Link to="/apropos" className={navLinkClass("/apropos")}>
              <Info className="h-3.5 w-3.5 inline mr-1" /> Àpropos
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/putulu-admin"
                className={navLinkClass("/putulu-admin")}
              >
                <LayoutDashboard className="h-3.5 w-3.5 inline mr-1" />{" "}
                Dashboard
              </Link>
            )}
            <Link to="/contact" className={navLinkClass("/contact")}>
              <Phone className="h-3.5 w-3.5 inline mr-1" /> Contact
            </Link>
          </div>

          {/* Desktop — section droite */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  {/* Avatar initiales */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.first_name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown user */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded border border-slate-200 shadow py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-400 font-medium">
                        Connecté en tant que
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {displayName}
                      </p>
                      {user.role && (
                        <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-600 capitalize">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <Link
                      to="/book"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <BookCopy className="h-3.5 w-3.5" />
                      Mes livres
                    </Link>
                    <Link
                      to="/my-loans"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Book className="h-3.5 w-3.5" />
                      Mes emprunts
                    </Link>
                    <Link
                      to="/profil"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User className="h-3.5 text-purple-800 w-3.5" />
                      Mon profil
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Se connecter
                </Link>
                <Link
                  to="/registration"
                  className="px-4 py-2 rounded bg-purple-800 text-white text-sm font-semibold hover:bg-purple-600 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile — bouton hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link to="/" className={mobileNavLinkClass("/")}>
            <Home className="h-3.5 w-3.5 inline mr-2" /> Home
          </Link>
          <Link to="/apropos" className={mobileNavLinkClass("/apropos")}>
            <Info className="h-3.5 w-3.5 inline mr-2" /> À propos
          </Link>

          {isAuthenticated && (
            <Link to="/book" className={mobileNavLinkClass("/book")}>
              <Book className="h-3.5 w-3.5 inline mr-2" /> Books
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/putulu-admin"
              className={mobileNavLinkClass("/putulu-admin")}
            >
              <LayoutDashboard className="h-3.5 w-3.5 inline mr-2" /> Dashboard
            </Link>
          )}
          <Link to="/contact" className={mobileNavLinkClass("/contact")}>
            <Phone className="h-3.5 w-3.5 inline mr-2" /> Contact
          </Link>


          <div className="border-t border-slate-100 pt-3 mt-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>
                    {user.role && (
                      <p className="text-xs text-purple-500 font-medium capitalize">
                        {user.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Liens rapides du profil en Mobile */}
                <Link
                  to="/my-loans"
                  className={mobileNavLinkClass("/my-loans")}
                >
                  <Book className="h-3.5 w-3.5 inline mr-2" /> Mes emprunts
                </Link>
                <Link to="/profil" className={mobileNavLinkClass("/profil")}>
                  <User className="h-3.5 w-3.5 inline mr-2" /> Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  className="w-full px-4 py-2 text-sm font-medium text-center text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Se connecter
                </Link>
                <Link
                  to="/registration"
                  className="w-full px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold text-center hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
    </nav>
  );
}
