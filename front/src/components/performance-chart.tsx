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
  return translations[term as keyof typeof translations] || term; // Retourne la traduction ou le terme original s'il n'y a pas de traduction
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
    data = [], // Données de performance (vide si aucune donnée n'est récupérée)
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performanceData", userId], // Clé de la requête pour la mise en cache
    queryFn: () => fetchPerformanceData(userId), // Fonction pour récupérer les données depuis l'API
  });

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement...</div>; // Affiche un message de chargement
  if (error || !data.length) return <div>Aucune donnée disponible</div>; // Affiche un message d'erreur ou si aucune donnée n'est présente

  // Réorganiser les données pour correspondre à l'ordre des sujets du graphique
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
          {/* Grille polaire pour l'arrière-plan du graphique */}
          <PolarGrid stroke="#FFFFFF" strokeOpacity={0.5} />
          {/* Axe des angles (les sujets de performance), avec traduction */}
          <PolarAngleAxis
            dataKey="subject" // Utilisation de la clé 'subject' pour l'axe des angles
            tick={{ fill: "#FFFFFF", fontSize: 12 }} // Style des ticks de l'axe
            tickFormatter={(value) => translate(value)} // Traduction des termes en français
          />
          {/* Suppression des ticks et de la ligne de l'axe radial */}
          <PolarRadiusAxis tick={false} axisLine={false} />
          {/* Le graphique radar qui affiche les valeurs de performance */}
          <Radar
            name="Utilisateur"
            dataKey="value" // Utilisation de la clé 'value' pour les valeurs du radar
            stroke="#FF0101" // Couleur du contour
            fill="#FF0101" // Couleur de remplissage
            fillOpacity={0.6} // Transparence du remplissage
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
