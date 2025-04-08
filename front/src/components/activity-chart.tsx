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
import { fetchActivityData } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "./error-message";

// Type definition for the props
interface ActivityChartProps {
  userId?: number; // userId prop optionnel
}

// Composant personnalisé pour dessiner des cercles dans la légende
const CustomLegend = (props: any) => {
  const { payload } = props; // Récupère les données de la légende
  return (
    <ul className="flex space-x-8">
      {payload.map((entry: any) => (
        <li key={entry.dataKey} className="flex items-center">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }} // Applique la couleur de l'élément
          ></div>
          <span className="ml-2">
            {entry.dataKey === "kilogram"
              ? "Poids (kg)"
              : "Calories brûlées (kCal)"}
          </span>
        </li>
      ))}
    </ul>
  );
};

const ActivityChart = ({ userId: propUserId }: ActivityChartProps) => {
  // Fonction pour récupérer l'userId depuis l'URL
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    return userId ? parseInt(userId, 10) : 12;
  };

  // Récupérer l'userId à partir de la prop ou de l'URL
  const userId = propUserId ?? getUserIdFromUrl();

  // Effectuer la requête pour récupérer les données d'activité
  const { data, error, isLoading } = useQuery({
    queryKey: ["activity", userId],
    queryFn: () => fetchActivityData(userId),
    staleTime: 1000 * 60 * 5,
  });

  // Gestion du chargement et des erreurs
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage />;
  if (!data || data.length === 0) {
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.
      </div>
    );
  }

  // Fonction pour formater le jour à partir de la date complète
  const formatDay = (date: string) => {
    const day = new Date(date).getDate();
    return day.toString();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Titre du graphique */}
      <h3 className="text-l font-semibold mb-4">Activité quotidienne</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="5 5" />
          <XAxis dataKey="day" tickFormatter={formatDay} />
          <YAxis orientation="right" />
          <Tooltip />
          {/* Légende personnalisée en haut à droite */}
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="right"
            content={<CustomLegend />}
          />
          <Bar
            dataKey="kilogram"
            fill="#282D30"
            barSize={14} // Taille des barres
          />
          <Bar
            dataKey="calories"
            fill="#E60000"
            barSize={14} // Taille des barres
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
