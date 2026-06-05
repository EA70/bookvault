import React from "react";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend 
  } from "recharts/umd/Recharts";

export default function DashboardCharts({ chartData }) {
    const COLORS = ["#7c3aed", "#2563eb", "#db2777", "#ea580c", "#16a34a", "#4b5563"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
    {/* Graphique en barres — Emprunts par mois */}
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <BarChart3 className="w-8 h-8 text-purple-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-800">Activité des emprunts</h3>
          <p className="text-[10px] text-slate-400">Volume des prêts sur les 6 derniers mois</p>
        </div>
      </div>
      
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.monthlyLoans} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month_label" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1e293b", borderRadius: "6px", border: "none" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="loan_count" name="Livres empruntés" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/*  Graphique en Donut — Répartition des livres par catégorie */}
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <PieIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-800">Catégories les plus demandées</h3>
          <p className="text-[10px] text-slate-400">Répartition proportionnelle des lectures</p>
        </div>
      </div>

      <div className="h-64 w-full text-xs flex items-center justify-center">
        {chartData.categoryDistribution.length === 0 ? (
          <p className="text-slate-400 italic">Aucune donnée d'emprunt enregistrée</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60} 
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderRadius: "6px", border: "none" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", pt: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>

  </div>
  );
}