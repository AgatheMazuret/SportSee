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

const PerformanceChart = ({ userId: propUserId }: { userId?: number }) => {
  // Récupérer l'URL actuelle
  const url = window.location.href;

  // Expression régulière pour extraire le userId de l'URL
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Si userId est passé en prop, l'utiliser, sinon chercher dans l'URL ou utiliser 12 par défaut
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performanceData", userId], // Utiliser l'userId pour la requête
    queryFn: () => fetchPerformanceData(userId),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error || !data.length) return <div>Aucune donnée disponible</div>;

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
