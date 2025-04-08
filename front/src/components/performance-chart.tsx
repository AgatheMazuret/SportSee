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

// Dictionnaire de traduction des termes
const translations = {
  intensity: "Intensité",
  speed: "Vitesse",
  strength: "Force",
  endurance: "Endurance",
  energy: "Énergie",
  cardio: "Cardio",
};

// Fonction pour traduire les termes
const translate = (term: string) => {
  return translations[term as keyof typeof translations] || term; // Si aucune traduction n'est trouvée, retourner le terme d'origine
};

const PerformanceChart = ({ userId: propUserId }: { userId?: number }) => {
  const url = window.location.href;

  // Expression régulière pour extraire l'userId de l'URL si disponible
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Déterminer l'userId à utiliser : priorité à la prop, sinon prendre celui de l'URL ou 12 par défaut
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  // Effectuer la requête pour récupérer les données de performance
  const {
    data = [], // Données de performance, valeur par défaut vide si aucune donnée n'est récupérée
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performanceData", userId], // Clé de la requête pour la mise en cache
    queryFn: () => fetchPerformanceData(userId), // Fonction pour récupérer les données de performance
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error || !data.length) return <div>Aucune donnée disponible</div>;

  // Réorganiser les données selon l'ordre souhaité
  const orderedData = [
    {
      subject: "intensity",
      value: data.find((item) => item.subject === "intensity")?.value || 0,
    },
    {
      subject: "speed",
      value: data.find((item) => item.subject === "speed")?.value || 0,
    },
    {
      subject: "strength",
      value: data.find((item) => item.subject === "strength")?.value || 0,
    },
    {
      subject: "endurance",
      value: data.find((item) => item.subject === "endurance")?.value || 0,
    },
    {
      subject: "energy",
      value: data.find((item) => item.subject === "energy")?.value || 0,
    },
    {
      subject: "cardio",
      value: data.find((item) => item.subject === "cardio")?.value || 0,
    },
  ];

  // Affichage du graphique radar avec les données de performance
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#282D30]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={80} data={orderedData}>
          {/* Grille polaire */}
          <PolarGrid stroke="#FFFFFF" strokeOpacity={0.5} />
          {/* Axe des angles avec les étiquettes traduites */}
          <PolarAngleAxis
            dataKey="subject" // Utilisation de la clé 'subject' pour l'axe des angles
            tick={{ fill: "#FFFFFF", fontSize: 12 }} // Configuration des ticks de l'axe
            tickFormatter={(value) => translate(value)} // Traduction des termes
          />
          {/* Suppression des ticks et de la ligne de l'axe radial */}
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
