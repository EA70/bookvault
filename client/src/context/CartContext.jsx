import { createContext, useState, useEffect } from 'react';
import api from '../services/api';  

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  const [userQuota, setUserQuota] = useState({ totalBorrowed: 0, activeBookIds: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem('buchvault_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    fetchUserQuota();
  }, []);

  // Fonction pour synchroniser le quota avec le backend
  const fetchUserQuota = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { data } = await api.get('/users/quota');
      setUserQuota(data);
    } catch (err) {
      console.error("Impossible de charger le quota de l'étudiant :", err);
    }
  };

  // Ajouter un livre au panier avec vérification stricte du cumul et des doublons BDD
  const addToCart = (book) => {
  
    const rawSavedCart = localStorage.getItem('buchvault_cart');
    const currentSavedCart = rawSavedCart ? JSON.parse(rawSavedCart) : [];

    // 1. On vérifie dans le stockage instantané si l'ID y est déjà
    if (currentSavedCart.some(item => item.id === book.id)) {
      return alert("Ce livre est déjà dans votre panier !");
    }

    // 2. Vérification du quota en BDD (inchangé)
    const activeIds = userQuota?.activeBookIds ?? [];
    if (activeIds.includes(book.id)) {
      return alert(`Opération impossible : Vous possédez déjà "${book.title}" (ou une demande est en attente).`);
    }

    // 3. Calcul de la limite avec la taille réelle et instantanée du localStorage
    const totalBorrowedInDB = userQuota?.totalBorrowed ?? 0;
    const totalFutur = totalBorrowedInDB + currentSavedCart.length;
    
    if (totalFutur >= 3) {
      return alert(
        `Limite atteinte ! Vous ne pouvez pas dépasser 3 livres au total.`
      );
    }
    
    // 4. Écriture immédiate et immuable
    const newCart = [...currentSavedCart, book];
    setCart(newCart);
    localStorage.setItem('buchvault_cart', JSON.stringify(newCart));
  };
  
  const removeFromCart = (bookId) => {
    const newCart = cart.filter(item => item.id !== bookId);
    setCart(newCart);
    localStorage.setItem('buchvault_cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('buchvault_cart');
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      userQuota,       
      fetchUserQuota,   
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};