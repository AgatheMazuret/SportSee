import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchActivityData, fetchUserInfo } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "./error-message";

// ========== Types communs ==========
// Déclaration des types pour les props des composants
interface ActivityChartProps {
  userId?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
}

interface LegendPayload {
  dataKey: string;
  color: string;
}

interface CustomLegendProps {
  payload: LegendPayload[];
}

// ========== Composants enfants ==========

// Composant pour afficher la légende du graphique
const CustomLegend = ({ payload = [] }: CustomLegendProps) => (
  <ul className="flex space-x-8">
    {payload.map((entry) => (
      <li key={entry.dataKey} className="flex items-center">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: entry.color }}
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

// Composant personnalisé pour afficher le tooltip dans le graphique
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length === 2) {
    const weight = payload.find((p) => p.dataKey === "kilogram")?.value;
    const calories = payload.find((p) => p.dataKey === "calories")?.value;

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

// Composant pour afficher un message personnalisé à l'utilisateur
const Hello = ({ userId }: { userId: number }) => {
  const userInfoQuery = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfo(userId),
    staleTime: 1000 * 60 * 5,
  });

  const { data, error, isLoading } = userInfoQuery;
  if (isLoading) {
    return (
      <div className="flex flex-col items-start justify-center mb-6">
        <p className="text-5xl">Chargement...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start justify-center mb-6">
      <p className="text-5xl">
        Bonjour <span className="text-red-500">{data?.firstName}</span>
      </p>
      {!error && (
        <p className="text-lg mt-[41px]">
          Félicitations ! Vous avez explosé vos objectifs hier 👏
        </p>
      )}
    </div>
  );
};

// ========== Composant Principal Fusionné ==========

// Composant principal pour afficher le tableau de bord d'activité
const ActivityDashboard = ({ userId: propUserId }: ActivityChartProps) => {
  // Fonction pour récupérer l'userId à partir de l'URL (si non fourni dans les props)
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    return userId ? parseInt(userId, 10) : 12;
  };

  const userId = propUserId ?? getUserIdFromUrl();

  // Utilisation de React Query pour récupérer les données d'activité
  const { data, error, isLoading } = useQuery({
    queryKey: ["activity", userId],
    queryFn: () => fetchActivityData(userId),
    staleTime: 1000 * 60 * 5,
  });

  // Fonction pour formater la date dans le graphique
  const formatDay = (date: string) => {
    const day = new Date(date).getDate();
    return day.toString();
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage />;
  if (!data || data.length === 0) {
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.{" "}
      </div>
    );
  }

  return (
    <div className="p-2 bg-white rounded-xl shadow-lg">
      <Hello userId={userId} />{" "}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-l font-semibold">Activité quotidienne</h3>
        <CustomLegend
          payload={[
            // Légende personnalisée avec les couleurs pour poids et calories
            { dataKey: "kilogram", color: "#282D30" },
            { dataKey: "calories", color: "#E60000" },
          ]}
        />
      </div>
      {/* Graphique */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="5 5" />
            <XAxis dataKey="day" tickFormatter={formatDay} />{" "}
            {/* Formatage des jours */}
            <YAxis orientation="right" />
            <Tooltip content={<CustomTooltip />} />{" "}
            {/* Affichage du tooltip personnalisé */}
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

export default ActivityDashboard;
