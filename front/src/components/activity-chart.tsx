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
  userId?: number; // userId prop optionnel
}

const ActivityChart = ({ userId: propUserId }: ActivityChartProps) => {
  // Fonction pour récupérer l'userId depuis l'URL
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search); // Récupérer les paramètres de l'URL
    const userId = urlParams.get("userId");
    return userId ? parseInt(userId, 10) : 12;
  };

  // Récupérer l'userId à partir de la prop ou de l'URL
  const userId = propUserId ?? getUserIdFromUrl(); // Priorité à la prop userId, sinon on utilise celui de l'URL

  // Effectuer la requête pour récupérer les données d'activité
  const activityQuery = useQuery({
    queryKey: ["activity", userId], // Clé de la requête (pour mise en cache)
    queryFn: () => fetchActivityData(userId), // Fonction qui récupère les données
    staleTime: 1000 * 60 * 5,
  });

  if (activityQuery.isLoading) {
    return <div>Chargement des données...</div>;
  }

  // Fonction pour formater le jour à partir de la date complète
  const formatDay = (date: string) => {
    const day = new Date(date).getDate(); // Extraire le jour du mois
    return day.toString(); // Retourner le jour sous forme de chaîne
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={activityQuery.data} // Données de l'activité
        style={{ backgroundColor: "#FBFBFB" }}
      >
        <CartesianGrid vertical={false} strokeDasharray="5 5" />{" "}
        <XAxis dataKey="day" tickFormatter={formatDay} />{" "}
        {/* Formater l'axe X pour afficher le jour */}
        <YAxis orientation="right" /> {/* Positionner l'axe Y à droite */}
        <Tooltip /> {/* Afficher un tooltip au survol */}
        <Legend layout="horizontal" verticalAlign="top" align="right" />{" "}
        <Bar dataKey="kilogram" fill="#282D30" barSize={7} radius={3} />{" "}
        <Bar dataKey="calories" fill="#E60000" barSize={7} radius={3} />{" "}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
