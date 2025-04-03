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

const fetchData = async (): Promise<FormattedLengthData[]> => {
  return await fetchSessionData();
};

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

const SectionLengthChart = () => {
  // Récupérer l'URL actuelle
  const url = window.location.href;

  // Expression régulière pour trouver le paramètre 'userId' dans l'URL
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Si un userId est trouvé, l'utiliser. Sinon, utiliser 12 par défaut.
  const userId = match ? parseInt(match[1], 10) : 12;

  const { data = [], isLoading } = useQuery({
    queryKey: ["sessionData", userId],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-red-500">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} style={{ backgroundColor: "red" }}>
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
