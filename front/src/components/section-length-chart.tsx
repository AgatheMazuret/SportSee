import { fetchSessionData } from "../services/api";
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
import { useQuery } from "@tanstack/react-query";

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

  const finalUserId = userId ?? getUserIdFromUrl(); // Priorité à la prop
  // Vérifie si `finalUserId` est bien défini

  const { data = [], isLoading } = useQuery({
    queryKey: ["sessionData", finalUserId],
    queryFn: async () => {
      return fetchSessionData(finalUserId);
    },
  });

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (data.length === 0) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-red-500">
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
