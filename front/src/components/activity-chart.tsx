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

// Type definition for the props
interface ActivityChartProps {
  userId?: number; // Optional userId prop
}

const ActivityChart = ({ userId: propUserId }: ActivityChartProps) => {
  // Fonction pour récupérer l'userId depuis l'URL
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search); // Utilisation de window.location.search pour accéder aux paramètres d'URL
    const userId = urlParams.get("userId");
    return userId ? parseInt(userId, 10) : 12; // Valeur par défaut si aucun userId trouvé
  };

  // Récupérer l'userId de la prop ou de l'URL
  const userId = propUserId ?? getUserIdFromUrl(); // Priorise la prop userId, sinon prend celui de l'URL

  // Effectuer la requête avec le userId dynamique
  const activityQuery = useQuery({
    queryKey: ["activity", userId],
    queryFn: () => fetchActivityData(userId),
    staleTime: 1000 * 60 * 5, // Données fraîches pendant 5 minutes
  });

  if (activityQuery.isLoading) {
    return <div>Chargement des données...</div>;
  }

  // Fonction pour formater le jour à partir de la date complète (au format 'YYYY-MM-DD')
  const formatDay = (date: string) => {
    const day = new Date(date).getDate(); // Récupérer uniquement le jour du mois
    return day.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={activityQuery.data}
        style={{ backgroundColor: "#FBFBFB" }}
      >
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
