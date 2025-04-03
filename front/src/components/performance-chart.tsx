import { useQuery } from "@tanstack/react-query";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { fetchPerformanceData } from "../services/api";

const PerformanceChart = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["performanceData", 12], // Remplace 12 par l'ID utilisateur dynamique si nécessaire
    queryFn: () => fetchPerformanceData(12),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!data.length) return <div>Aucune donnée disponible</div>;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#282D30]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={80} data={data}>
          <PolarGrid stroke="#FFFFFF" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
          />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar
            name="Utilisateur"
            dataKey="value"
            stroke="#FF0101"
            fill="#FF0101"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
