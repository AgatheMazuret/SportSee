import { useQuery } from "@tanstack/react-query";
import { fetchSessionData } from "../services/api"; // Assure-toi d'avoir bien ce service d'API
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// Abbréviations des jours
const dayAbbreviations = ["L", "M", "M", "J", "V", "S", "D"];

// Tooltip personnalisé
const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length > 0) {
    const sessionLength = payload[0]?.value ?? 0;
    const dayIndex = payload[0]?.payload?.day ?? 1;
    const day = dayAbbreviations[dayIndex - 1] || "";

    return (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <p>{`Jour: ${day}`}</p>
        <p>{`Durée de session: ${sessionLength} min`}</p>
      </div>
    );
  }
  return null;
};

const SectionLengthChart = ({ userId }: { userId?: number }) => {
  // Récupération du userId depuis l'URL si non fourni en prop
  const getUserIdFromUrl = () => {
    const regex = /[?&]userId=(\d+)/;
    const match = window.location.href.match(regex);
    return match ? parseInt(match[1], 10) : 12; // Valeur par défaut : 12
  };

  // Si userId n'est pas fourni en prop, on prend celui de l'URL
  const finalUserId = userId ?? getUserIdFromUrl();

  // Requête pour récupérer les données de session pour l'`userId`
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessionData", finalUserId], // On passe l'ID de l'utilisateur en tant que clé de la requête
    queryFn: () => fetchSessionData(finalUserId), // On appelle la fonction pour récupérer les données
  });

  // Affichage pendant le chargement des données
  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  // Si erreur ou pas de données, afficher un message d'erreur
  if (error || data.length === 0) {
    return <div>Aucune donnée disponible pour cet utilisateur.</div>;
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-red-600">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} horizontal={false} />
          <YAxis hide={true} />
          <XAxis
            dataKey="day"
            tickFormatter={(value) => dayAbbreviations[value - 1]}
            tick={{ fill: "white" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={customTooltip} />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="right"
            formatter={(value) => (
              <span style={{ color: "white" }}>{value}</span>
            )}
          />
          <Line
            name="Durée moyenne des sessions"
            dataKey="sessionLength"
            stroke="white"
            strokeWidth={3}
            type="monotone"
            strokeLinejoin="round"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionLengthChart;
