import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
interface LegendPayload {
  dataKey: string;
  color: string;
}

interface CustomLegendProps {
  payload: LegendPayload[];
}

const CustomLegend = (props: CustomLegendProps) => {
  const { payload = [] } = props; // Récupère les données de la légende ou utilise un tableau vide par défaut
  return (
    <ul className="flex space-x-8">
      {payload.map((entry: LegendPayload) => (
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

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { dataKey: string; value: number }[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length === 2) {
      const weight = payload.find(
        (p: { dataKey: string; value: number }) => p.dataKey === "kilogram"
      )?.value;
      const calories = payload.find(
        (p: { dataKey: string; value: number }) => p.dataKey === "calories"
      )?.value;

      return (
        <div
          className="text-white text-sm p-2 rounded"
          style={{
            backgroundColor: "#E60000",
            lineHeight: "1.5",
            textAlign: "center",
            width: "70px",
          }}
        >
          <p>{weight}kg</p>
          <p>{calories}Kcal</p>
        </div>
      );
    }

    return null;
  };

  // Fonction pour formater le jour à partir de la date complète
  const formatDay = (date: string) => {
    const day = new Date(date).getDate();
    return day.toString();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Conteneur du titre et de la légende */}
      <div className="flex justify-between items-center mb-4">
        {/* Titre du graphique */}
        <h3 className="text-l font-semibold">Activité quotidienne</h3>

        {/* Légende positionnée à droite du titre */}
        <div className="flex ml-4">
          <CustomLegend
            {...{
              payload: [
                { dataKey: "kilogram", color: "#282D30" },
                { dataKey: "calories", color: "#E60000" },
              ],
            }}
          />
        </div>
      </div>

      {/* Graphique */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="5 5" />
            <XAxis dataKey="day" tickFormatter={formatDay} />
            <YAxis orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="kilogram"
              fill="#282D30"
              barSize={8}
              radius={[7, 7, 0, 0]}
            />
            <Bar
              dataKey="calories"
              fill="#E60000"
              barSize={8}
              radius={[7, 7, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
