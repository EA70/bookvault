

import { useState, useEffect } from "react";
import api from "../../services/api";
import BooksDemande from "./BooksDemande"; 

export default function RequeteDemande() {
  const [tickets, setTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get("/api/loans/borrows/pending");
      const grouped = data.reduce((acc, current) => {
        const foundUser = acc.find(u => u.user_id === current.user_id);
        const bookInfo = {
          borrow_id: current.borrow_id,
          book_id: current.book_id,
          title: current.title,
          author: current.author,
          copies_available: current.copies_available
        };

        if (foundUser) {
          foundUser.books.push(bookInfo);
        } else {
          acc.push({
            user_id: current.user_id,
            student_name: current.first_name,
            student_lastname: current.last_name,
            student_email: current.email,
            books: [bookInfo]
          });
        }
        return acc;
      }, []);

      setTickets(grouped);
    } catch (err) {
      console.error("Erreur de chargement des requêtes :", err);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const showNotification = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  //  C'est la fonction :  accepter/refuser
  const handleDecision = async (borrowId, action) => {
    setIsSubmitting(true);
    try {
      const { data } = await api.put(`/api/loans/borrows/${borrowId}/decision`, { action });
      showNotification(data.message);
      await fetchPendingRequests();
    } catch (err) {
      console.error("Erreur lors de la décision :", err);
      alert(err.response?.data?.message ?? "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BooksDemande 
      tickets={tickets} 
      onDecision={handleDecision} 
      isSubmitting={isSubmitting} 
      toast={toast} 
    />
  );
}