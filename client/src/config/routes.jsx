import Home from "../components/Home";
import Login from "../pages/auth/Login";
import Book from "../pages/users/Book";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Registration from "../pages/auth/Registration";
import RegisterSuccess from "../pages/auth/RegisterSuccess";

import BooksRetour from "../pages/admin/BooksRetour";
import BooksAction from "../pages/admin/BooksAction";
import Users from "../pages/admin/Users";

import Apropos from "../components/Apropos";
import MyBorrows from "../pages/users/MyBorrows";
import Profil from "../pages/users/Profil";
import RequeteDemande from "../pages/admin/RequeteDemande";
import UserLoansHistory from "../pages/users/UserLoansHistory";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Contact from "../components/Contact";
import ListeLoans from "../pages/admin/components/AutresLites/ListeLoans";
import ListeRetard from "../pages/admin/components/AutresLites/ListeRetard";

/**
 * ROUTES PUBLIQUES GLOBALES
 * Accessibles par tout le monde, tout le temps (connecté ou non)
 */
export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/apropos", element: <Apropos /> },
  { path: "/contact", element: <Contact /> },
];

/**
 * ROUTES D'AUTHENTIFICATION
 * Accessibles UNIQUEMENT aux visiteurs anonymes.
 * Si l'utilisateur est connecté, PublicRoute le redirigera automatiquement loin d'ici !
 */
export const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/registration", element: <Registration /> }, 
  { path: "/register-success", element: <RegisterSuccess /> }, 
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
];

/**
 * ROUTES CLIENTS PROTEGÉES
 * Accessibles aux utilisateurs connectés.
 * Note : Assure-toi que ton composant 'ProtectedRoute' laisse aussi passer l'admin 
 * si tu veux qu'il puisse voir le catalogue général des livres !
 */
export const protectedRoutes = [
  { path: "/book", element: <Book /> },
  { path: "/my-loans", element: <MyBorrows /> },
  { path: "/profil", element: <Profil /> },
  { path: "/my-history", element: <UserLoansHistory /> },
];

/**
 * ROUTES ADMINISTRATEUR STRICTES
 * Totalement interdites aux étudiants, réservées au Super Admin.
 */
export const adminRoutes = [
  { path: "/putulu-admin", element: <AdminDashboard /> },
  { path: "/putulu-admin/returns", element: <BooksRetour /> },
  { path: "/putulu-admin/books", element: <BooksAction /> },
  { path: "/putulu-admin/students", element: <Users /> },
  { path: "/putulu-admin/demandes/livres", element: <RequeteDemande /> },
  { path: "/putulu-admin/loans", element: <ListeLoans /> },
  { path: "/putulu-admin/overdue-returns", element: <ListeRetard /> },
];