import { fetchSessionData, FormattedLengthData } from "../services/api";
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

// Définir le type des props pour le composant SectionLengthChart
interface SectionLengthChartProps {
  userId?: number; // `userId` est optionnel pour gérer l'URL dynamiquement
}

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

const SectionLengthChart: React.FC<SectionLengthChartProps> = ({ userId }) => {
  // Si userId n'est pas fourni en prop, on le récupère depuis l'URL
  if (!userId) {
    const url = window.location.href;
    const regex = /[?&]userId=(\d+)/;
    const match = url.match(regex);
    userId = match ? parseInt(match[1], 10) : 12; // Valeur par défaut : 12
  }

  const { data = [], isLoading } = useQuery({
    queryKey: ["sessionData", userId],
    queryFn: () => fetchSessionData(userId), // Passer le bon userId à l'API
  });

  if (isLoading) {
    return <div>Chargement des données...</div>;
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
