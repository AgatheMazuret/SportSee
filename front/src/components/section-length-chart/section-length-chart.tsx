import { useEffect, useState } from "react";
import { fetchSessionData, FormattedLengthData } from "./service"; // Importation du service
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TooltipProps } from "recharts";

type CustomTooltipProps = TooltipProps<number, string>;

const SectionLengthChart = () => {
  const [data, setData] = useState<FormattedLengthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchSessionData();
      setData(fetchedData);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  const dayAbbreviations = ["L", "M", "M", "J", "V", "S", "D"];

  const customTooltip: React.FC<CustomTooltipProps> = ({
    payload = [],
    label,
    active,
  }) => {
    if (active && payload.length > 0 && label !== undefined) {
      const sessionLength = payload[0]?.payload?.sessionLength ?? 0;
      const day = dayAbbreviations[label - 1] || "";
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
            formatter={() => "Durée moyenne des sessions"}
          />
          <Line
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
