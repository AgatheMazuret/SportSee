// src/ActivityChart.tsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchActivityData } from "../../services/api";

type FormattedActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

const ActivityChart = () => {
  const [data, setData] = useState<FormattedActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchActivityData(12); // Utiliser l'ID de l'utilisateur
        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  // Fonction pour formatter le jour à partir de la date complète (au format 'YYYY-MM-DD')
  const formatDay = (date: string) => {
    const day = new Date(date).getDate(); // Récupérer uniquement le jour du mois
    return day.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} style={{ backgroundColor: "#FBFBFB" }}>
        <CartesianGrid vertical={false} strokeDasharray="5 5" />
        {/* Personnalisation de l'axe X pour afficher juste le jour */}
        <XAxis dataKey="day" tickFormatter={formatDay} />
        <YAxis orientation="right" />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="right" />
        <Bar dataKey="kilogram" fill="#282D30" barSize={7} radius={3} />
        <Bar dataKey="calories" fill="#E60000" barSize={7} radius={3} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
