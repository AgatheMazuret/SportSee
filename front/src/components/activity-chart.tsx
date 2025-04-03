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

const ActivityChart = ({ userId: propUserId }: { userId?: number }) => {
  // Récupérer l'URL actuelle
  const url = window.location.href;

  // Expression régulière pour trouver le paramètre 'userId' dans l'URL
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Si un userId est trouvé, l'utiliser. Sinon, utiliser 12 par défaut.
  const userId = match ? parseInt(match[1], 10) : propUserId || 12;

  // Effectuer la requête avec le userId dynamique
  const activityQuery = useQuery({
    queryKey: ["activity", userId], // Utilisation du userId dynamique
    queryFn: () => fetchActivityData(userId), // Appel à l'API avec le userId
    staleTime: 1000 * 60 * 5, // Données fraîches pendant 5 minutes
  });

  if (activityQuery.isLoading) {
    return <div>Chargement des données...</div>;
  }

  // Fonction pour formatter le jour à partir de la date complète (au format 'YYYY-MM-DD')
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
