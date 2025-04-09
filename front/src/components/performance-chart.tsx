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
import { formatPerformanceData } from "../utils/formatter";

// Dictionnaire de traduction des termes pour les sujets de performance
const translations = {
  intensity: "Intensité",
  speed: "Vitesse",
  strength: "Force",
  endurance: "Endurance",
  energy: "Énergie",
  cardio: "Cardio",
};

// Fonction pour traduire un terme en français
const translate = (term: string) => {
  return translations[term as keyof typeof translations] || term;
};

// Composant pour afficher le graphique des performances
const PerformanceChart = ({ userId: propUserId }: { userId?: number }) => {
  const url = window.location.href;

  // Extraction de l'userId depuis l'URL via une expression régulière
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Détermine l'userId : priorité à la prop, sinon celui de l'URL, sinon 12 par défaut
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  // Utilisation de React Query pour récupérer les données de performance
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performanceData", userId],
    queryFn: () => fetchPerformanceData(userId),
    staleTime: 1000 * 60 * 5,
  });

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement...</div>;
  if (error || !data.length) return <div>Aucune donnée disponible</div>;
  const orderedData = formatPerformanceData(data);

  // Affichage du graphique radar avec les données de performance
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#282D30]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={80} data={orderedData}>
          {/* Grille polaire pour l'arrière-plan du graphique */}
          <PolarGrid stroke="#FFFFFF" strokeOpacity={0.5} />
          {/* Axe des angles (les sujets de performance), avec traduction */}
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
            tickFormatter={(value) => translate(value)}
          />
          {/* Suppression des ticks et de la ligne de l'axe radial */}
          <PolarRadiusAxis tick={false} axisLine={false} />
          {/* Le graphique radar qui affiche les valeurs de performance */}
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
