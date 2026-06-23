import { useEffect, useState } from "react";
import api from "../../services/api";
import PendingRequests from "./components/PendingRequests";
import KpiCards from "./components/KpiCards";
import RecentAndOverdueLoans from "./components/RecentAndOverdueLoans";
import QuickActivity from "./components/QuickActivity";
import StockAlerts from "./components/StockAlerts";
import DashboardCharts from "./components/DashboardCharts";

export default function AdminDashboard() {

  const [kpis, setKpis] = useState({
    totalBooks: 0,
    activeLoans: 0,
    overdueReturns: 0,
    totalStudents: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [chartData, setChartData] = useState({
    monthlyLoans: [],
    categoryDistribution: [],
  });

  const [actionLists, setActionLists] = useState({
    recentLoans: [],
    overdueLoans: [],
  });

  const [quickActivity, setQuickActivity] = useState({
    topBooks: [],
    recentStudents: [],
  });

  const [pendingRequests, setPendingRequests] = useState([]);

  const [stockAlerts, setStockAlerts] = useState({
    stockOut: [],
    criticalStock: [],
  });


  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // bloc 5 Action 
  const handleAction = async (id, actionType) => {
    try {
      await api.put(`/api/dashboard/pending/${id}/${actionType}`);
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
      const { data } = await api.get("/api/dashboard/kpis");
      setKpis(data);
    } catch (error) {
      console.error(`Erreur lors de l'action ${actionType}:`, error);
      alert("Une erreur est survenue lors du traitement de la demande.");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpiRes, chartsRes, actionsRes, quickRes, pendingRes, stockRes] =
          await Promise.all([
            api.get("/api/dashboard/kpis"),
            api.get("/api/dashboard/graphics"),
            api.get("/api/dashboard/actions"),
            api.get("/api/dashboard/quick-activity"),
            api.get("/api/dashboard/pending"),
            api.get("/api/dashboard/stock-alerts"),
          ]);

        setKpis(kpiRes.data);
        setActionLists(actionsRes.data);
        setQuickActivity(quickRes.data);
        setPendingRequests(pendingRes.data);
        setStockAlerts(stockRes.data);

        // Formatage des données graphiques (Bloc 2)
        const formattedMonthly = chartsRes.data.monthlyLoans.map((item) => ({
          ...item,
          loan_count: parseInt(item.loan_count, 10),
        }));

        setChartData({
          monthlyLoans: formattedMonthly,
          categoryDistribution: chartsRes.data.categoryDistribution.map(
            (item) => ({
              name: item.category_name,
              value: parseInt(item.value, 10),
            }),
          ),
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du dashboard:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-500 animate-pulse font-manrope">
        Chargement des indicateurs clés...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* BLOC 1 — KPI Cards (Strictement inchangé) */}
        <KpiCards kpis={kpis} />

        {/* BLOC 2 — Graphiques (Côte à côte sur desktop via la grille Tailwind) */}
        <DashboardCharts chartData={chartData} />

        {/* BLOC 3 — Emprunts récents & Retours en retard */}
        <RecentAndOverdueLoans
          actionLists={actionLists}
          formatDateTime={formatDateTime}
        />

        {/* BLOC 4 — Activité rapide */}
        <QuickActivity
          quickActivity={quickActivity}
          formatDateTime={formatDateTime}
        />
        {/* BLOC 5 — Demandes en attente (Flux de validation) */}
        <PendingRequests
          requests={pendingRequests}
          onAction={handleAction}
          formatDateTime={formatDateTime}
        />
        {/* BLOC 6 — État du Stock & Alertes Critiques */}
        <StockAlerts stockAlerts={stockAlerts} />
      </div>
    </div>
  );
}
