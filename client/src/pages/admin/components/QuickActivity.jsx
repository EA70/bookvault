import React from "react";
import { BookType, Users } from "lucide-react";

export default function QuickActivity({ quickActivity, formatDateTime }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      
      {/* Colonne Gauche : Livres les plus empruntés */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookType className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Top des lectures</h3>
            <p className="text-[10px] text-slate-400">Les livres les plus demandés par les étudiants</p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-50 h-full justify-center">
          {quickActivity.topBooks.length === 0 ? (
            <p className="text-slate-400 italic text-center text-xs py-6">Aucun classement disponible</p>
          ) : (
            quickActivity.topBooks.map((book, index) => (
              <div key={book.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Position / Rang */}
                  <span className="text-xs font-black text-slate-300 w-4 text-center group-hover:text-purple-600 transition-colors">
                    {index + 1}
                  </span>
                  
                  {/* Image de couverture ou fallback */}
                  {book.cover_image ? (
                    <img 
                      src={book.cover_image} 
                      alt={book.title} 
                      className="w-9 h-12 rounded object-cover border border-slate-100 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <BookType className="w-4 h-4 text-slate-400" />
                    </div>
                  )}

                  {/* Titre & Auteur */}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-[260px]">
                      {book.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      par {book.author}
                    </p>
                  </div>
                </div>

                {/* Compteur d'emprunts */}
                <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-md border border-purple-100 whitespace-nowrap">
                  {book.borrow_count} emprunts
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Colonne Droite : Derniers étudiants inscrits */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Nouveaux membres</h3>
            <p className="text-[10px] text-slate-400">Les derniers étudiants ayant rejoint la bibliothèque</p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-50 h-full justify-center">
          {quickActivity.recentStudents.length === 0 ? (
            <p className="text-slate-400 italic text-center text-xs py-6">Aucun étudiant inscrit récemment</p>
          ) : (
            quickActivity.recentStudents.map((student) => {
              // Génération locale des initiales
              const initials = `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`.toUpperCase();
              
              return (
                <div key={student.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar textuel */}
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      {initials || "ST"}
                    </div>

                    {/* Nom & Email */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[160px] sm:max-w-[220px]">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  {/* Date d'inscription */}
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    Inscrit le {formatDateTime(student.created_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}